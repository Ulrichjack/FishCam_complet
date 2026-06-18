import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

    const token = localStorage.getItem('fishcam_token');

    if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq); // Send the cloned request with the token
  }

  // If no token, just send the normal request
  return next(req);
};


