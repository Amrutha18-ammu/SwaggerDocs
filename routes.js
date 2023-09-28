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
 *       phoneNumber:
 *         type: string
 *       country:
 *         type: string
 *       commission:
 *         type: number
 *       workingArea:
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
    app.post('/agent', async (req, res) => {
      let agent = req.body
      if (!agent.id || !agent.phoneNumber || !agent.country || !agent.workingArea) {
        res.status(400).send("all fields are required");
      } else if (agent.commission == 0) {
        res.status(400).send("commission cannot be 0");
      } else {
        var result = await createAgent(req.body)
        if (result.affectedRows) {
            res.send("created");
          } else {
            res.status(409).send("error");
          }

        }
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
    app.put('/agent/:agentCode',async (req, res) => {
      console.log(req.body);
      console.log(req.params.agentCode);
      var result = await updateAgent(req.params.agentCode, req.body)
      if (result.affectedRows) {
          res.send("created");
        } else {
          res.status(409).send("error");
        }
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

    
    app.delete('/agent/:agentCode', async (req, res) => {
      var rows= await deleteAgent(req.params.agentCode)
      console.log(rows)
      if (rows.length == 0) {
        res.status(404).send("No records found")
       } else {
        res.status(200).send("Successfully deleted")
       }
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

    async function  createAgent(agent){
      const insertQuery = "INSERT INTO agents value (?, ?, ?, ?, ?, ?)"
  
    let conn;
    
    try {
          conn = await pool.getConnection();
          const rows = await conn.query(insertQuery, [agent.id.trim(), agent.name.trim(), agent.workingArea.trim(), agent.commission, agent.phoneNumber.trim(),agent.country.trim()])
      return rows
    } catch (error) {
      console.error(error);
      return {}
    }
     finally {
          if (conn) conn.release(); //release to pool
    }
  }
  
  async function  updateAgent(id, agent) {
    const a = "UPDATE agents SET AGENT_NAME = ?, WORKING_AREA = ?, COMMISSION = ?, PHONE_NO = ?, COUNTRY = ? WHERE AGENT_CODE = ?"
  let conn;
  try {
        conn = await pool.getConnection();
        const rows = await conn.query(a, [agent.name, agent.workingArea, agent.commission, agent.phoneNumber,agent.country, id])
        return rows
  } catch (error) {
    console.error(error);
    return {}
  }
   finally {
        if (conn) conn.release(); //release to pool
  }
}
async function  deleteAgent(id) {
  const a = "delete from agents WHERE AGENT_CODE = ?"
let conn;
try {
      conn = await pool.getConnection();
      const rows = await conn.query(a, [id])
      return rows
} catch (error) {
  console.error(error);
  return {}
}
 finally {
      if (conn) conn.release(); //release to pool
}
}
}



