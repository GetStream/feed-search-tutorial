import { createFeedsContext } from '@stream-io/graphql-feeds';
import jwt from 'jsonwebtoken';

export const context = ({ req, connection }) => {
    let token;
    let auth;

    if (connection) {
        token = connection.context.Authorization ? connection.context.Authorization.replace(/^Bearer\s/u, '') : '';
    } else {
        token = req.headers.authorization ? req.headers.authorization.replace(/^Bearer\s/u, '') : '';
    }

    if (token) {
        auth = jwt.verify(token, process.env.STREAM_SECRET);
    }

    return {
        auth,
        stream: createFeedsContext(process.env.STREAM_KEY, process.env.STREAM_SECRET, process.env.STREAM_ID),
    };
};