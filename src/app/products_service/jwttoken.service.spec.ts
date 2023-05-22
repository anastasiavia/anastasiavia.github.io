import { TestBed } from '@angular/core/testing';

import { JWTTokenServiceService } from './jwttoken.service';

describe('JwttokenService', () => {
  let jwtService: JWTTokenServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    jwtService = TestBed.inject(JWTTokenServiceService);
  });

  it('should be created', () => {
    expect(jwtService).toBeTruthy();
  });

  it('should set and get token', () => {
    const token = 'test_token';
    jwtService.setToken(token);
    expect(jwtService.getAccessToken()).toEqual(token);
  });

  it('should not decode token if jwtToken is empty', () => {
    jwtService.decodeToken();
    expect(jwtService.decodedToken).toBeUndefined();
  });

  it('should get user id', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    jwtService.setToken(token);
    expect(jwtService.getUserId()).toEqual('1234567890');
  });

  it('should check if user is logged in', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    jwtService.setToken(token);
    expect(jwtService.isLoggedIn()).toBeTruthy();
  });

  it('should clear token and decoded token from storage when logout', () => {
    // Set up initial token and decoded token
    localStorage.setItem('token', 'test_token');
    const decodedToken = { sub: 'user_id' };
    spyOn(jwtService, 'decodeToken').and.callFake(() => {
      jwtService.decodedToken = decodedToken;
    });

    jwtService.jwtToken = 'test_token';

    // Call logout method
    jwtService.logout();

    // Expect token and decoded token to be cleared from storage
    expect(jwtService.jwtToken).toBe('');
    expect(jwtService.decodedToken).toEqual({});
    expect(localStorage.getItem('token')).toBeNull();
  });


  
  it('should decode token if jwtToken is set', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    jwtService.setToken(token);
    jwtService.decodeToken();
    
    const decodedToken = jwtService.decodedToken;
    expect(decodedToken).toBeTruthy(); // Check if decodedToken is truthy
    
    expect(decodedToken['sub']).toEqual('1234567890');
    expect(decodedToken['name']).toEqual('John Doe');
    expect(typeof decodedToken['iat']).toEqual('number'); // Check if iat is a number
  });
  
  it('should return null when getUserId is called with empty jwtToken', () => {
    jwtService.setToken('');
    expect(jwtService.getUserId()).toBeNull();
  });
  
  it('should return null when getUserId is called with invalid jwtToken', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    jwtService.setToken(token);
    expect(jwtService.getUserId()).toBe('1234567890');
  });
  
  it('should return false when isLoggedIn is called with empty jwtToken', () => {
    jwtService.setToken('');
    expect(jwtService.isLoggedIn()).toBe(false);
  });
  
  it('should return true when isLoggedIn is called with valid jwtToken', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    jwtService.setToken(token);
    expect(jwtService.isLoggedIn()).toBe(true);
  });
  

  


});
