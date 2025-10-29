-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "contact" TEXT,
    "password" TEXT,
    "status" TEXT NOT NULL,
    "role" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "contact" TEXT,
    "address" TEXT,
    "map_url" TEXT,
    "rfc" TEXT,
    "postal_code" TEXT,
    "status" TEXT,
    "optional_contact" TEXT,
    "optional_email" TEXT,
    "company_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "readed" INTEGER NOT NULL,
    "class" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment_cat" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Equipment_cat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand_cat" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Brand_cat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" SERIAL NOT NULL,
    "equipment_cat_id" INTEGER NOT NULL,
    "brand_cat_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "model" TEXT NOT NULL,
    "serial_number" TEXT NOT NULL,
    "failure" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "customer_id" INTEGER,
    "monthly_payment" TEXT,
    "interest" TEXT,
    "payment_advance" TEXT,
    "discount" TEXT,
    "per_diem" TEXT,
    "discount_per_diem" TEXT,
    "days_per_diem" INTEGER,
    "fee" TEXT,
    "iva" TEXT,
    "comments" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_item" (
    "id" SERIAL NOT NULL,
    "quote_id" INTEGER,
    "quantity" INTEGER,
    "description" TEXT,
    "unit_price" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quote_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER,
    "user_id" INTEGER,
    "comments" TEXT,
    "status" TEXT NOT NULL,
    "quote_id" INTEGER,
    "type_income" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repair_report" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER,
    "comments" TEXT,
    "diagnosis" TEXT,
    "solution" TEXT,
    "observations" TEXT,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Repair_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Per_diem" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER,
    "user_id" INTEGER,
    "vehicle" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "start_km" INTEGER NOT NULL,
    "end_km" INTEGER NOT NULL,
    "total_km" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "people" INTEGER NOT NULL,
    "hotel" INTEGER NOT NULL,
    "gasoline" INTEGER NOT NULL,
    "fee" INTEGER NOT NULL,
    "food" INTEGER NOT NULL,
    "vehicle_cost" INTEGER NOT NULL,
    "extras" INTEGER NOT NULL,
    "comments" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Per_diem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promissory_note" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "quantity_text" TEXT NOT NULL,
    "quantity_digit" INTEGER NOT NULL,
    "day_text" TEXT NOT NULL,
    "day_digit" INTEGER NOT NULL,
    "month_text" TEXT NOT NULL,
    "month_digit" INTEGER NOT NULL,
    "year_text" TEXT NOT NULL,
    "year_digit" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promissory_note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" SERIAL NOT NULL,
    "photeable_id" INTEGER NOT NULL,
    "photeable_type" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "file_name" TEXT NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" SERIAL NOT NULL,
    "model_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "noteable_id" INTEGER NOT NULL,
    "noteable_type" TEXT NOT NULL,
    "note_type" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" SERIAL NOT NULL,
    "delivery_parcel" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "deliveriable_type" TEXT NOT NULL,
    "deliveriable_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" SERIAL NOT NULL,
    "remindable_type" TEXT NOT NULL,
    "remindable_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "remind_at" TIMESTAMP(3) NOT NULL,
    "reminded" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Format" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Format_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Notification_user_id_fkey" ON "Notification"("user_id");

-- CreateIndex
CREATE INDEX "Equipment_brand_cat_id_fkey" ON "Equipment"("brand_cat_id");

-- CreateIndex
CREATE INDEX "Equipment_equipment_cat_id_fkey" ON "Equipment"("equipment_cat_id");

-- CreateIndex
CREATE INDEX "Equipment_order_id_fkey" ON "Equipment"("order_id");

-- CreateIndex
CREATE INDEX "Quote_customer_id_fkey" ON "Quote"("customer_id");

-- CreateIndex
CREATE INDEX "Quote_user_id_fkey" ON "Quote"("user_id");

-- CreateIndex
CREATE INDEX "quote_item_quote_id_fkey" ON "quote_item"("quote_id");

-- CreateIndex
CREATE INDEX "Order_customer_id_fkey" ON "Order"("customer_id");

-- CreateIndex
CREATE INDEX "Order_quote_id_fkey" ON "Order"("quote_id");

-- CreateIndex
CREATE INDEX "Order_user_id_fkey" ON "Order"("user_id");

-- CreateIndex
CREATE INDEX "Repair_report_order_id_fkey" ON "Repair_report"("order_id");

-- CreateIndex
CREATE INDEX "Per_diem_customer_id_fkey" ON "Per_diem"("customer_id");

-- CreateIndex
CREATE INDEX "Per_diem_user_id_fkey" ON "Per_diem"("user_id");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_brand_fkey" FOREIGN KEY ("brand_cat_id") REFERENCES "Brand_cat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_equipment_cat_fkey" FOREIGN KEY ("equipment_cat_id") REFERENCES "Equipment_cat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_order_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_customer_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_user_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_item" ADD CONSTRAINT "quote_item_quote_fkey" FOREIGN KEY ("quote_id") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customer_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_quote_fkey" FOREIGN KEY ("quote_id") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repair_report" ADD CONSTRAINT "Repair_report_order_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Per_diem" ADD CONSTRAINT "Per_diem_customer_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Per_diem" ADD CONSTRAINT "Per_diem_user_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promissory_note" ADD CONSTRAINT "Promissory_note_customer_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_user_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
