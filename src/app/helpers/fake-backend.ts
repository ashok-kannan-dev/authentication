import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
 
export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions) {

    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFzaG9rIEsiLCJhZG1pbiI6dHJ1ZX0.La8ofa-iNbaYGBqw-eApPUNud17wxooe5rnwYwGnspo';

    backend.connections.subscribe((connection: MockConnection) => {
      // We are using the setTimeout() function to simulate an asynchronous call 
      // to the server that takes 1 second. 
      setTimeout(() => {
        //
        // Fake implementation of /api/authenticate
        //
        if (connection.request.url.endsWith('/api/authenticate') && 
            connection.request.method === RequestMethod.Post) {
            let body = JSON.parse(connection.request.getBody());

            if (body.email === 'ashok.rj7339@gmail.com' && body.password === 'ak123') {
              connection.mockRespond(new Response(
                new ResponseOptions({ 
                  status: 200, 
                  body: { token: token }
                })
              ));
            } else {
              connection.mockRespond(new Response(
                new ResponseOptions({ status: 200 })
              ));
            }
        }
        


        // 
        // Fake implementation of /api/orders
        //
        if (connection.request.url.endsWith('/api/orders') && connection.request.method === RequestMethod.Get) {
            if (connection.request.headers.get('Authorization') === 'Bearer ' + token) {
                connection.mockRespond(new Response(
                    new ResponseOptions({ status: 200, body: [1, 2, 3] })
                ));
            } else {
                connection.mockRespond(new Response(
                    new ResponseOptions({ status: 401 })
                ));
            }
        }     
          
        

      }, 1000);
    });
 
    return new Http(backend, options);
}
 
export let fakeBackendProvider = {
    provide: Http,
    useFactory: fakeBackendFactory,
    deps: [MockBackend, BaseRequestOptions]
};