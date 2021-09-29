const express = require("express");
const {WsProvider,ApiPromise} = require("@polkadot/api")
const {hexToString} = require("@polkadot/util")
const types = require("./types.json")

const app = express()
const wsProvider = new WsProvider("ws://3.137.159.162:9945")
var api = {}

const init = async () => {
    api = await ApiPromise.create({ provider: wsProvider,types: types });
    console.log("api initialized");
}

init()
app.use(express.json())

app.get('/api/wallet/:address',async (req,res) => {
    let { address } = req.params
    
    try {
        let data = await api.query['vtbDex']['wallet'](address) 
        let pdot_addr= hexToString(data.polkadot_address.toString('hex'))
        let crypto_addresses = data.crypto_addresses.map(item => {
          
            return {
                "crypto_network" : hexToString(item.crypto_network.toString('hex')),
                "crypto_address" : hexToString(item.crypto_addresses.toString('hex')),
                "deposit_balance" : parseInt(item.deposit_balance.toString())
               
            }
        })
        let jsonResp = {
            "polkadot_address" : pdot_addr,
            "VTBc_balance" : parseInt(data.VTBc_balance.toString()),
            "VTBt_balance" : parseInt(data.VTBt_balance.toString()),
            "crypto_addresses" : crypto_addresses
        }

        return res.status(200).json(jsonResp)   
    } catch (error) {
        console.log(error)
        return res.status(500).json({"error":error.message})
        
    }
    
})

app.listen(5000,async ()=>{
    console.log("server started")
    
})