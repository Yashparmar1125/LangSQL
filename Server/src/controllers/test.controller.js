import  testDatabaseConnection  from '../utils/testdbconnection.util.js';

const testConnection = async (req, res) => {
    try{
    const result= await testDatabaseConnection(req.body);
    console.log(result)
    return res.status(result.success ? 200 : 500).json({
        message: "success"
    });
}catch(error){
    console.log("error:",error)
    res.status(500).json({message:"false"})
}
};

export default testConnection;
