import prisma from "../config/prisma";
import { listResource } from '../utils/list-resource';
import { Per_diem, Gasoline_charge, Extra_expense } from "@prisma/client";

export interface PerDiemCreateData {
  customer_id: number;
  user_id: number;
  vehicle: string;
  start_date: Date;
  end_date?: Date;
  start_km: number;
  end_km: number;
  total_km: number;
  city: string;
  people: number;
  hotel: number;
  fee: number;
  food: number;
  vehicle_cost: number;
  comments?: string;
  gasoline_charges: { name: string; amount: number }[];
  extra_expenses: { name: string; amount: number }[];
}

export interface PerDiemUpdateData {
  customer_id?: number;
  vehicle?: string;
  start_date?: Date;
  end_date?: Date;
  start_km?: number;
  end_km?: number;
  total_km?: number;
  city?: string;
  people?: number;
  hotel?: number;
  fee?: number;
  food?: number;
  vehicle_cost?: number;
  comments?: string;
  gasoline_charges?: { name: string; amount: number }[];
  extra_expenses?: { name: string; amount: number }[];
}

export const PerDiemService = {
  async createPerDiem(data: PerDiemCreateData): Promise<Per_diem> {
    const { gasoline_charges, extra_expenses, ...perDiemData } = data;
    
    return await prisma.per_diem.create({
      data: {
        ...perDiemData,
        created_at: new Date(),
        gasoline_charges: {
          create: gasoline_charges.map(charge => ({
            name: charge.name,
            amount: charge.amount,
            created_at: new Date()
          }))
        },
        extra_expenses: {
          create: extra_expenses.map(expense => ({
            name: expense.name,
            amount: expense.amount,
            created_at: new Date()
          }))
        }
      },
      include: {
        customer: true,
        user: true,
        gasoline_charges: true,
        extra_expenses: true
      }
    });
  },

  async getAllPerDiems(query: any){
    return listResource(
      'per_diem',
      query,
      ['vehicle', 'city', 'comments'],
      { 
        customer: true,
        user: true,
        gasoline_charges: true,
        extra_expenses: true
      },
      { created_at: 'desc' },
    );
  },

  async getPerDiemsByCustomer(query: any) {
    return listResource(
      'per_diem',
      query,
      ['vehicle', 'city', 'comments'],
      { 
        customer: true, 
        user: true,
        gasoline_charges: true,
        extra_expenses: true
      },
      { created_at: 'desc' },
      { customer_id: query.customer_id },
    );
  },

  async getPerDiemById(id: number): Promise<Per_diem | null> {
    return await prisma.per_diem.findUnique({ 
      where: { id }, 
      include: { 
        customer: true, 
        user: true,
        gasoline_charges: true,
        extra_expenses: true
      } 
    });
  },

  async updatePerDiem(id: number, data: PerDiemUpdateData): Promise<Per_diem> {
    const { gasoline_charges, extra_expenses, ...perDiemData } = data;
    
    return await prisma.per_diem.update({
      where: { id },
      data: {
        ...perDiemData,
        updated_at: new Date(),
        ...(gasoline_charges && {
          gasoline_charges: {
            deleteMany: {},
            create: gasoline_charges.map(charge => ({
              name: charge.name,
              amount: charge.amount,
              created_at: new Date()
            }))
          }
        }),
        ...(extra_expenses && {
          extra_expenses: {
            deleteMany: {},
            create: extra_expenses.map(expense => ({
              name: expense.name,
              amount: expense.amount,
              created_at: new Date()
            }))
          }
        })
      },
      include: {
        customer: true,
        user: true,
        gasoline_charges: true,
        extra_expenses: true
      }
    });
  },

  async deletePerDiem(id: number): Promise<Per_diem> {
    return await prisma.per_diem.delete({ where: { id } });
  },
};
