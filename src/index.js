import 'dotenv/config';
import { ApolloServer } from 'apollo-server';

import schema, { dataSources } from './schema';
import { context } from './schema/context';

const server = new ApolloServer({
    context,
    dataSources,
    schema,
});

server.listen().then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server ready at ${url}`);
});
