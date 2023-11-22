-- db sensor

create table sensor(
    id      int primary key,
    nombre    varchar(255) not null,
    puerto    varchar(255) not null,
    longitud    varchar(255) not null,
    latitud    varchar(255) not null,
    imagen    varchar(255) not null
);

-- table data
create table data(
    id      int primary key,
    sensor_id    int not null,
    fecha    varchar(255) not null,
    hora   varchar(255) not null,
    valor    varchar(255) not null,
    foreign key (sensor_id) references sensor(id)
);