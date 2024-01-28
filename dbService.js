const mysql = require('mysql');
let instance = null;

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "web_project",
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state);
});


class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async insertNewData(fullName, email, guests, date, time){
        try{

            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO reservations (fullName, email, guests, date ,time) VALUES (?,?,?,?,?);";
    
                connection.query(query, [fullName, email, guests, date ,time], (err, result) => {
                    if(err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });

            return {
                id : insertId,
                fullName : fullName,
                email : email,
                guests : guests,
                date : date,
                time : time
            };

        }catch(error){
            console.log(error);
        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM reservations WHERE id = ?";
    
                connection.query(query, [id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateRecordById(updateData) {
        try {
            const { id, ...fieldsToUpdate } = updateData;
    
            const response = await new Promise((resolve, reject) => {

                if (Object.keys(fieldsToUpdate).length === 0) {

                    resolve(false);
                } else {
                    const updateFields = Object.keys(fieldsToUpdate).map(field => `${field} = ?`).join(', ');

                    const values = Object.values(fieldsToUpdate);
    
                    const query = `UPDATE reservations SET ${updateFields} WHERE id = ?`;

                    connection.query(query, [...values, id], (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.affectedRows);
                    });
                }
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async searchByName(email) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM reservations WHERE email = ?;";

                connection.query(query, [email], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = DbService;