// import mysql from 'mysql2'


// export const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     database: 'assignment_4_part3',
// });

import mysql from 'mysql2';

export const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'assignment_4_part3',
});