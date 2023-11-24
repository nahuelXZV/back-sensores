import { Data, DataModel } from '../model/data.model';
import { Socket } from 'socket.io';
import { NotificationsService } from './firebase.service';
import { Sensor, SensorModel } from '../model/sensor.model';


export async function handlerData(data: String, socket: Socket, sensor_id: number) {
    const sensorModel = new SensorModel(undefined);
    const dataAtr: Data = {
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),
        valor: data.toString(),
        sensor_id,
    };

    // SOCKETS
    socket.emit("new-data", dataAtr);
    console.log("Enviado...", dataAtr);
    if (sensor_id != 1) return;

    const dataModel = new DataModel(dataAtr);
    dataModel.store();

    // NOTIFICACION
    const valor = parseInt(dataAtr.valor);
    if (valor < 300) return;

    const sensor: Sensor | undefined = await sensorModel.getOne(1);
    const listTokens = [
        "cggnVJTlTD-kBgm1NgaUrU:APA91bFdCXOJNLyxhptSNf3b3Mdw9IP6liRDGO_N-tPMGiT8KMiM-iEh4xEHlveYVdItdQT85VUr7aeOiew5XwanNIT_hazMhYqusPDMF5yHrYNU94-6xqWBT_XJ1I6JCcJY3mtHu3P_",
        "euTnATbR_iVL1y93Q0VnP:APA91bGRPfFBf4M6soUly5iQ20rHqHyRHeK7eIAjwMEiJZuzC9Y8djiz11Ip_sDiFqI0KaUoSHON5uiR8HHdr2WuW8iNqCs5-RwmAkyXkw9ifKBNnDOdXRKA_70NtBCytJN8KE8YIZT1",
        "cUI9-DuJS3S1ilP84v0UbZ:APA91bGBxnT_UvPHtquz0NRNUBphAbktdfsZzp4eMxO3CjOEN3kVKO3-ESiEt6nOg72GBUntYhJyrAUaPnzfZBYUxkMssPVH-Q6mjmev5K1FBoajh6w7QuhKcCfk3XH3w_qd1JZF3XeE"
    ];
    const mapa = 'https://www.google.com/maps/search/?api=1&query=' + sensor?.longitud + ',' + sensor?.latitud;

    listTokens.forEach(token => {
        new NotificationsService().sendNotification({
            token,
            mapa,
            data: dataAtr,
        });
    });
    console.log("Enviado...");
}

