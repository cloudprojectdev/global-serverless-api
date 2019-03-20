import { Handler, Context, Callback } from 'aws-lambda'
import AWS = require('aws-sdk'); 
import { Result, Status } from '../Result';

const documentClient = new AWS.DynamoDB.DocumentClient();

export async function getCountry(event: any, context: Context) {
    const id = event.pathParameters.id;
    var params:AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName: 'Countries',
        AttributesToGet: [
            'id',
            'name',
            'region',
            'worldRank'
        ],
        Key: {
            'id': parseInt(id)
        }
    }
    let result;
    try {
        result = await documentClient.get(params).promise();
    } catch(err) {
        return new Result(Status.InternalServerError, { error: err.message }).asLambdaResult();
    }

    result.Region = process.env.AWS_REGION;
    return new Result(Status.OK, result).asLambdaResult();
}

export async function getCountries(event: any, context: Context) {
    var params:AWS.DynamoDB.DocumentClient.ScanInput = {
        TableName: 'Countries',
        AttributesToGet: [
            'id',
            'name'
        ],
        Limit: 200
    }
    let result
    try {
        result = await documentClient.scan(params).promise()
    } catch(err) {
        return new Result(Status.InternalServerError, { error: err.message }).asLambdaResult()
    }
    let output = {
        Countries: result.Items,
        Count: result.Items.length,
        Region: process.env.AWS_REGION
    }
    return new Result(Status.OK, output).asLambdaResult()
}