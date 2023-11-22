import { SerialPort } from 'serialport'
import { Data, DataModel } from '../model/data.model';
import { Socket } from 'socket.io';

const port = new SerialPort({
    path: '/dev/COM6',
    baudRate: 57600,
});

port.on('open', () => {
    console.log('Puerto Abierto');
});

port.on('data', (data: Buffer) => {
    console.log(data.toString());
});

export function handlerData(data: Buffer, socket: Socket) {
    const dataAtr: Data = {
        fecha: new Date("YYYY-MM-DD").toString(),
        hora: new Date("HH:MM:SS").toString(),
        valor: data.toString(),
        sensor_id: 1,
    };
    const dataModel = new DataModel(dataAtr);
    dataModel.store();
    // notificacion

    // socket
    socket.emit("new-data", dataAtr);
}

