import { Data } from "../model/data.model";

export class NotificationsService {

    url: string = "https://fcm.googleapis.com/fcm/send";

    constructor(
    ) { }

    async sendNotification(dataFoto: { mapa: string, data: Data, token: string }) {
        const header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAAlhktAmw:APA91bFWM6UCsEJHWEU7BhNSQ1zprL8P8BiLR64Bq8Yl_RCAe-BDfm0tOi-bI7FSV8zB-OqsK0BuoarxN1aC56hiUcm-opkjDkpWCVCmaJLGNdXw1f0vhe4pAYj_xujOxnCsudNHxZ9-'
            }
        }
        const data = {
            "to": dataFoto.token,
            "notification": {
                "title": "Cuidado!",
                "body": "Se ha detectado un nivel de CO alto",
            },
            "data": {
                'mapa': dataFoto.mapa,
                'data': dataFoto.data
            }
        };
        const response = await fetch(this.url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: header.headers,
        });
        return response;
    }






}
