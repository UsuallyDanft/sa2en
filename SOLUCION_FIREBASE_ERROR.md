# Solución al Error Firebase: auth/operation-not-allowed

## Problema Identificado

El error `auth/operation-not-allowed` indica que **Firebase Authentication no tiene habilitado el método de registro con email/password** en la consola de Firebase.

## Solución Paso a Paso

### 1. Acceder a la Consola de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `sa2en-app`
3. En el menú lateral, haz clic en **"Authentication"**

### 2. Habilitar el Método de Autenticación

1. En la página de Authentication, ve a la pestaña **"Sign-in method"**
2. Busca **"Email/Password"** en la lista de proveedores
3. Haz clic en **"Email/Password"**
4. **Activa el toggle** para habilitar este método
5. Opcionalmente, puedes activar:
   - ✅ **"Email link (passwordless sign-in)"** si quieres envío de enlaces
   - ✅ **"Email link (passwordless sign-in)"** para registro sin contraseña
6. Haz clic en **"Save"**

### 3. Verificar Configuración Adicional

#### Configuración de Dominios Autorizados
1. En Authentication → Settings → Authorized domains
2. Asegúrate de que tu dominio esté en la lista
3. Para desarrollo local, `localhost` debe estar incluido

#### Configuración de Reglas de Firestore
Verifica que las reglas de Firestore permitan escritura en las colecciones necesarias:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura a usuarios autenticados
    match /gerentes/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /empleados_autorizados/{email} {
      allow read, write: if request.auth != null;
    }
    
    match /emailsAutorizados/{docId} {
      allow read: if request.auth != null;
    }
  }
}
```

### 4. Verificar en el Código

El código ya incluye validaciones mejoradas. Para verificar que todo funciona:

1. Ejecuta la aplicación
2. Intenta registrar un nuevo gerente
3. Verifica los logs en la consola

### 5. Posibles Errores Adicionales

Si después de habilitar el método sigues teniendo problemas:

#### Error de Red
- Verifica tu conexión a internet
- Asegúrate de que no haya restricciones de firewall

#### Error de Configuración
- Verifica que el `apiKey` y `projectId` sean correctos
- Asegúrate de que la app esté registrada en Firebase

#### Error de Permisos
- Verifica que las reglas de Firestore permitan las operaciones necesarias
- Asegúrate de que las colecciones existan en Firestore

## Verificación de la Solución

Después de aplicar estos cambios:

1. **Reinicia la aplicación** completamente
2. **Limpia la caché** si es necesario
3. **Intenta registrar un nuevo usuario**
4. **Verifica los logs** para confirmar que no hay errores

## Logs Esperados

Cuando todo esté funcionando correctamente, deberías ver:

```
📱 Firebase configurado para MÓVIL con persistencia AsyncStorage
📱 Plataforma detectada: android
✅ Firebase configurado correctamente
🔍 Verificación de configuración de Firebase Auth completada
```

## Contacto

Si el problema persiste después de seguir estos pasos, verifica:
- La configuración de tu proyecto Firebase
- Los logs de error específicos
- La conectividad de red 