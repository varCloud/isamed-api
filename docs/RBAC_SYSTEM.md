# Sistema de Roles y Permisos (RBAC)

Este documento describe el sistema de roles y permisos implementado en la aplicación.

## Estructura del Sistema

### Tablas Principales

1. **Role** - Define los roles disponibles en el sistema
2. **Resource** - Define los recursos/entidades sobre los cuales se aplican permisos
3. **Permission** - Define los permisos específicos (combinación de recurso + acción)
4. **RolePermission** - Asigna permisos a roles específicos
5. **UserPermission** - Permite sobrescribir permisos específicos para usuarios individuales

### Acciones Disponibles

- `create` - Crear nuevos registros
- `read` - Leer/Ver registros
- `update` - Actualizar registros existentes  
- `delete` - Eliminar registros

### Recursos del Sistema

- users - Gestión de usuarios
- customers - Gestión de clientes
- orders - Gestión de órdenes
- quotes - Gestión de cotizaciones
- equipment - Gestión de equipos
- per_diems - Gestión de viáticos
- repair_reports - Gestión de reportes de reparación
- notifications - Gestión de notificaciones
- photos - Gestión de fotos
- templates - Gestión de plantillas
- notes - Gestión de notas
- reminders - Gestión de recordatorios
- formats - Gestión de formatos
- promissory_notes - Gestión de pagarés
- brand_categories - Gestión de categorías de marca
- equipment_categories - Gestión de categorías de equipo
- roles - Gestión de roles
- permissions - Gestión de permisos

## Roles Predefinidos

### Admin
- Acceso completo a todas las funcionalidades del sistema
- Puede gestionar usuarios, roles y permisos

### Manager
- Acceso a la mayoría de funcionalidades excepto gestión de usuarios y roles
- Puede gestionar clientes, órdenes, equipos, reportes, etc.

### Technician
- Acceso limitado principalmente a órdenes, equipos y reportes de reparación
- Solo lectura para clientes y cotizaciones

### Viewer
- Solo lectura en la mayoría de funcionalidades
- No puede gestionar usuarios, roles ni permisos

## API Endpoints

### Roles

#### GET /api/roles
Obtener todos los roles
- **Requiere:** `roles:read`

#### GET /api/roles/:id
Obtener un rol específico
- **Requiere:** `roles:read`

#### POST /api/roles
Crear un nuevo rol
- **Requiere:** `roles:create`
- **Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "status": "active|inactive"
  }
  ```

#### PUT /api/roles/:id
Actualizar un rol
- **Requiere:** `roles:update`
- **Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "status": "active|inactive"
  }
  ```

#### DELETE /api/roles/:id
Eliminar un rol
- **Requiere:** `roles:delete`

#### POST /api/roles/:id/permissions
Asignar permisos a un rol
- **Requiere:** `roles:update`
- **Body:**
  ```json
  {
    "permissionIds": [1, 2, 3]
  }
  ```

#### GET /api/roles/:id/permissions
Obtener permisos de un rol
- **Requiere:** `roles:read`

### Permisos

#### GET /api/permissions
Obtener todos los permisos
- **Requiere:** `permissions:read`

#### GET /api/permissions/resources
Obtener todos los recursos
- **Requiere:** `permissions:read`

#### GET /api/permissions/resources/:resource
Obtener permisos por recurso
- **Requiere:** `permissions:read`

#### GET /api/permissions/my-permissions
Obtener permisos del usuario autenticado
- **No requiere permisos especiales**

#### GET /api/permissions/users/:userId
Obtener todos los permisos de un usuario
- **Requiere:** `permissions:read`

#### GET /api/permissions/users/:userId/specific
Obtener permisos específicos de un usuario
- **Requiere:** `permissions:read`

#### POST /api/permissions/users/:userId/:permissionId
Asignar permiso específico a un usuario
- **Requiere:** `permissions:update`
- **Body:**
  ```json
  {
    "granted": true|false
  }
  ```

#### DELETE /api/permissions/users/:userId/:permissionId
Remover permiso específico de un usuario
- **Requiere:** `permissions:delete`

#### POST /api/permissions/users/:userId/batch
Asignar múltiples permisos a un usuario
- **Requiere:** `permissions:update`
- **Body:**
  ```json
  {
    "permissions": [
      {
        "permissionId": 1,
        "granted": true
      },
      {
        "permissionId": 2,
        "granted": false
      }
    ]
  }
  ```

## Uso del Middleware

### Verificar un permiso específico
```typescript
import { checkPermission } from '../middleware/permission.middleware';

router.get('/customers', checkPermission('customers', 'read'), customerController.getAllCustomers);
```

### Verificar múltiples permisos (AND)
```typescript
import { checkMultiplePermissions } from '../middleware/permission.middleware';

router.post('/sensitive-action', 
  checkMultiplePermissions([
    { resource: 'orders', action: 'update' },
    { resource: 'customers', action: 'read' }
  ]), 
  someController.sensitiveAction
);
```

### Verificar al menos uno de varios permisos (OR)
```typescript
import { checkAnyPermission } from '../middleware/permission.middleware';

router.get('/dashboard', 
  checkAnyPermission([
    { resource: 'orders', action: 'read' },
    { resource: 'customers', action: 'read' },
    { resource: 'quotes', action: 'read' }
  ]), 
  dashboardController.getDashboard
);
```

## Verificación Programática

### Verificar permiso de usuario
```typescript
import permissionService from '../services/permission.service';

const canEdit = await permissionService.userHasPermission(userId, 'orders', 'update');
if (canEdit) {
  // Usuario puede editar órdenes
}
```

### Obtener todos los permisos de un usuario
```typescript
const userPermissions = await permissionService.getUserPermissions(userId);
```

## Gestión de Usuarios

Para asignar un rol a un usuario, actualiza el campo `role_id` en la tabla User:

```typescript
await prisma.user.update({
  where: { id: userId },
  data: { role_id: roleId }
});
```

## Precedencia de Permisos

1. **Permisos específicos de usuario** (UserPermission) tienen la mayor prioridad
2. **Permisos de rol** (RolePermission) se aplican si no hay permisos específicos de usuario
3. Si no hay permisos específicos ni de rol, se **deniega** el acceso por defecto

## Consideraciones de Seguridad

- Todos los endpoints requieren autenticación previa
- Los permisos se verifican en cada solicitud
- Los permisos específicos de usuario pueden tanto otorgar como denegar acceso
- El sistema sigue el principio de menor privilegio por defecto
- Los logs de acceso se pueden implementar en el middleware para auditoría

## Mantenimiento

### Agregar un nuevo recurso
1. Ejecutar el seeder de roles y permisos actualizado
2. Asignar los nuevos permisos a los roles correspondientes

### Migración de usuarios existentes
Los usuarios existentes pueden tener valores en el campo `role` (string). Se recomienda:
1. Mapear estos valores a los nuevos roles (`role_id`)
2. Mantener compatibilidad durante la transición
3. Eliminar el campo `role` una vez completada la migración
