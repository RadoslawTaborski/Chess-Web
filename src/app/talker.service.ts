import {Injectable} from '@angular/core';
import {Headers, Http} from "@angular/http";
import {Observable} from "rxjs";
import 'rxjs/Rx';

@Injectable()
export class TalkerService {

    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
    }

    public requestPost(url: string, data: any, callback: Function) {
        return this.http.post(url, "json=" + encodeURIComponent(JSON.stringify(data)), {headers: this.headers})
            .map(response => response.json())
            .subscribe(data => callback(data),
                function (error) {
                    console.log("Error happened" + error);
                });
    }

    public requestPostObservable(url: string, data: any): Observable<any> {
        return this.http.post(url, JSON.stringify(data), {headers: this.headers})
            .map(response => response.json());
    }
}