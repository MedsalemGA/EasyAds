import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Récupérer le token depuis localStorage
  const token = localStorage.getItem('token');

  console.log('🔐 AUTH INTERCEPTOR');
  console.log('URL:', req.url);
  console.log('Token trouvé:', token ? 'OUI (' + token.substring(0, 20) + '...)' : 'NON');

  // Si le token existe, cloner la requête et ajouter le header Authorization
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ Header Authorization ajouté');
    console.log('Headers:', clonedRequest.headers.keys());
    return next(clonedRequest);
  }

  console.log('⚠️ Pas de token - requête sans authentification');
  // Sinon, continuer avec la requête originale
  return next(req);
};

