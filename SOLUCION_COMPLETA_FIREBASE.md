# Solución Completa para Errores de Firebase

## Problemas Detectados

1. **auth/operation-not-allowed** - Registro de usuarios bloqueado
2. **Missing or insufficient permissions** - Reglas de Firestore muy restrictivas
3. **auth/admin-restricted-operation** - Autenticación anónima bloqueada

## Solución Paso a Paso

### 1. Configurar Firebase Authentication

#### Habilitar Métodos de Autenticación
1. Ve a [Firebase Console](https://console.firebase.google.com/project/sa2en-app/authentication/providers)
2. Selecciona tu proyecto: `sa2en-app`
3. Ve a **Authentication > Sign-in method**
4. **Habilita estos métodos**:
   - ✅ **Email/Password** (para registro de usuarios)
   - ✅ **Anonymous** (para diagnósticos y pruebas)

#### Configurar Dominios Autorizados
1. En **Authentication > Settings > Authorized domains**
2. Agrega estos dominios:
   - `localhost`
   - `127.0.0.1`
   - Tu dominio de producción (si tienes uno)

### 2. Configurar Reglas de Firestore

Ve a **Firestore Database > Rules** y reemplaza las reglas actuales con estas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acceso a usuarios autenticados
    match /gerentes/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
    
    match /empleados_autorizados/{email} {
      allow read, write: if request.auth != null;
    }
    
    match /emailsAutorizados/{docId} {
      allow read: if request.auth != null;
    }
    
    // Permitir acceso temporal para desarrollo
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Crear Colecciones Iniciales

Ve a **Firestore Database > Data** y crea estas colecciones:

#### Colección: `emailsAutorizados`
- **Documento de ejemplo**:
  ```json
  {
    "email": "admin@example.com",
    "rol": "admin",
    "fechaCreacion": "2024-01-01"
  }
  ```

#### Colección: `gerentes`
- Se creará automáticamente cuando se registre el primer gerente

#### Colección: `empleados_autorizados`
- Se creará automáticamente cuando se agreguen empleados

### 4. Verificar Configuración del Proyecto

#### Verificar Configuración de la App
1. Ve a **Project Settings > General**
2. Verifica que tu app esté registrada correctamente
3. Copia la configuración si es necesario

#### Verificar API Keys
1. Ve a **Project Settings > Service accounts**
2. Verifica que las claves de API estén activas

### 5. Configuración Adicional

#### Habilitar Firestore
1. Ve a **Firestore Database**
2. Si no está habilitado, haz clic en **"Create database"**
3. Selecciona **"Start in test mode"** para desarrollo

#### Configurar Storage (si lo necesitas)
1. Ve a **Storage**
2. Si no está habilitado, haz clic en **"Get started"**
3. Selecciona **"Start in test mode"** para desarrollo

## Verificación de la Solución

### 1. Reiniciar la Aplicación
```bash
# Detener la aplicación
Ctrl+C

# Limpiar caché
expo start --clear

# Reiniciar
expo start
```

### 2. Probar Registro de Gerente
1. Intenta registrar un nuevo gerente
2. Verifica que no aparezcan errores
3. Confirma que el usuario se crea en Firebase Auth
4. Confirma que los datos se guardan en Firestore

### 3. Logs Esperados
Cuando todo funcione correctamente, deberías ver:
```
📱 Firebase configurado para MÓVIL con persistencia AsyncStorage
📱 Plataforma detectada: android
✅ Firebase configurado correctamente
✅ Firebase Auth inicializado correctamente
✅ Firestore inicializado correctamente
✅ Colección 'gerentes' accesible (X documentos)
✅ Colección 'empleados_autorizados' accesible (X documentos)
✅ Colección 'emailsAutorizados' accesible (X documentos)
✅ Método de autenticación funcionando
```

## Solución de Problemas Comunes

### Si sigues viendo `auth/operation-not-allowed`:
1. **Espera 5-10 minutos** después de cambiar la configuración
2. **Limpia la caché** de la aplicación
3. **Verifica** que guardaste los cambios en Firebase Console

### Si sigues viendo errores de permisos:
1. **Verifica** que las reglas de Firestore se guardaron correctamente
2. **Espera** 1-2 minutos para que las reglas se propaguen
3. **Reinicia** la aplicación

### Si la autenticación anónima falla:
1. **Habilita** Anonymous auth en Firebase Console
2. **Verifica** que no hay restricciones de red
3. **Prueba** con una conexión diferente

## Configuración de Producción

Para producción, usa estas reglas más seguras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo gerentes pueden acceder a datos de gerentes
    match /gerentes/{userId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || 
         exists(/databases/$(database)/documents/gerentes/$(request.auth.uid)));
    }
    
    // Solo gerentes pueden gestionar empleados
    match /empleados_autorizados/{email} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/gerentes/$(request.auth.uid));
    }
    
    // Solo usuarios autenticados pueden leer emails autorizados
    match /emailsAutorizados/{docId} {
      allow read: if request.auth != null;
    }
  }
}
```

## Contacto y Soporte

Si después de seguir todos estos pasos sigues teniendo problemas:

1. **Verifica** los logs completos de la aplicación
2. **Comprueba** que todas las configuraciones se guardaron
3. **Prueba** en un dispositivo/emulador diferente
4. **Contacta** al administrador del proyecto Firebase 