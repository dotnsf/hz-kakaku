create table items(id int primary key auto_increment, name varchar(50) default null, image_url varchar(200) default null, code varchar(20) default null, created timestamp not null default current_timestamp, updated timestamp not null default current_timestamp on update current_timestamp, deleted int default 0 ) default charset=utf8;

create table places(id varchar(10) primary key, name varchar(50) default null, floor int default 0, created timestamp not null default current_timestamp, updated timestamp not null default current_timestamp on update current_timestamp, deleted int default 0 ) default charset=utf8;

create table prices(item_id int not null, place_id varchar(10) not null, price int default 0, created timestamp not null default current_timestamp, updated timestamp not null default current_timestamp on update current_timestamp, deleted int default 0, primary key( item_id, place_id ) ) default charset=utf8;
