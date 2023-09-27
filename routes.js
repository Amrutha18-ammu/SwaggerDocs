module.exports = function(app){
    const mariadb = require('mariadb');
    const pool = mariadb.createPool({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'sample',
        port: 3306,
        connectionLimit: 5
    });
    
 
    /**
     * @swagger
     * /agents/{agentCode}:
     *   get:
     *     description: Welcome to swagger-jsdoc!
     *     parameters:
     *       - in: path
     *         name: agentCode
     *         type: string
     *     responses:
     *       200:
     *         description: Returns a mysterious string.
     */
    app.get('/agents/:agentCode', async (req,res) => {
       var rows= await getById("agents", "AGENT_CODE", req.params.agentCode)
       if (rows.length == 0) {
        res.status(404).send("No records found")
       } else {
        res.status(200).json(rows[0])
       }
    });

    
/**
 * @swagger
 * definitions:
 *   agent:
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       phone-number:
 *         type: string
 *       country:
 *         type: string
 *       commission:
 *         type: string
 *       working-area:
 *         type: string
 */

/**
 * @swagger
 * /agent:
 *   post:
 *     tags:
 *       - agents
 *     description: Creating a new agent
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: agent
 *         description: Create agentCode
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/agent'
 *     responses:
 *       200:
 *         description: Successfully created
 *     404:
 *         description: If it is not Created
 */

    app.post('/agent', (req, res) => {
        console.log(req.body)
        res.json(req.body);
    });

/**
 * @swagger
 * /agent/{agentCode}:
 *   put:
 *     tags:
 *       - agents
 *     description: Update a new agent
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: agentCode
 *         type: string
 *       - name: agent
 *         description: Update a agent
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/agent'
 *     responses:
 *       200:
 *         description: Successfully created
 *     404:
 *         description: If it is not Created
 */
    app.put('/agent/:agentCode', (req, res) => {
        console.log(req.body)
        res.json(req.body);
    });
   /**
 * @swagger
 * 
 * /agent/{agentCode}:
 *   delete:
 *     tags:
 *       - agents
 *     description: Deletes a single agent
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: agentCode
 *         description: Agents Id will be deleted
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully deleted
 */

    
    app.delete('/agent/:agentCode', (req, res) => {
        console.log(req.body)
        res.json(req.body);
    });

    
    app.get('/company/:id', async (req,res) => {
        var rows= await getById("company", "COMPANY_ID", req.params.id)
        if (rows.length == 0) {
         res.status(404).send("No records found")
        } else {
         res.status(200).json(rows[0])
        }
     });
    
     app.get('/customers/:id', async (req,res) => {
        var rows= await getById("customer", "CUST_CODE", req.params.id)
        if (rows.length == 0) {
         res.status(404).send("No records found")
        } else {
         res.status(200).json(rows[0])
        }
     });
    
    app.get('/agents', async (req,res) => {
        var row = await getAll("agents")
         res.status(200).json(row)
     });
    
     app.get('/customers', async (req,res) => {
        var rows= await getAll("customer")
        var modifiedRows = rows.map(row => {
            return {
                code: row['CUST_CODE'],
                name: row['CUST_NAME'],
                phoneNumber: row['PHONE_NO'],
                agentCode: row['AGENT_CODE'],
            }
        })    
         res.status(200).json(modifiedRows)
     });
    
    
    
    async function getById(table, fieldName, fieldValue) {
        const selectQuery = `SELECT * FROM ${table} WHERE ${fieldName}=?`
        console.log(selectQuery)
      let conn;
      try {
    
        conn = await pool.getConnection();
        const rows = await conn.query(selectQuery,[fieldValue])
        return rows
    
      } finally {
            if (conn) conn.release(); //release to pool
      }
    }
    
    async function getAll(table) {
        const selectQuery = `SELECT * FROM ${table}`
        console.log(selectQuery)
      let conn;
      try {
            conn = await pool.getConnection();
            const rows = await conn.query(selectQuery)
        return rows
    
      } finally {
            if (conn) conn.release(); //release to pool
      }
    }
        
}