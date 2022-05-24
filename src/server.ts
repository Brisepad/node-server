import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';
import { Send, Query } from 'express-serve-static-core';

// Load config
dotenv.config();


const app: Application = express();
app.use(cors({origin: '*'}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const PORT: number = parseInt(<string>process.env.PORT, 10) || 5000;
const CMC_URL: string = <string>process.env.CMC_API_URL;
const CMC_KEY: string = <string>process.env.CMC_API_KEY;

export interface TypedResponse<ResBody> extends Express.Response {
    json: Send<ResBody, this>;
}

interface InfoType {
    success: Boolean;
    price: Number;
}

app.get('/getbriseprice', async(req: Request, res: Response): Promise<TypedResponse<InfoType>> => {
    try {
        const params = {
            slug: 'bitrise-token',
            convert: 'USD'
        }
        const url = CMC_URL;
        const CMC_API_KEY =  CMC_KEY;
        
        const response = await axios(url + new URLSearchParams(params).toString(), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CMC_PRO_API_KEY': CMC_API_KEY,
            },
        })
        const data = await response.data
        // console.log('CMC data: ', data.data['11079'].quote)
        return res.send({success: true, price: Number(data.data['11079'].quote.USD.price).toFixed(20)});
        
    } catch (error) {
        console.log(error);
        return res.send({success: false, price: 0});
        // throw new Error(error)
    }
});

app.listen(PORT, () => {
    console.log(`The application is listening on port ${PORT}`);
});