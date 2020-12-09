import { stitchSchemas } from '@graphql-tools/stitch';
import { schema as feedsSchema } from '@stream-io/graphql-feeds';
import algoliasearch from 'algoliasearch';

import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

const algolia = algoliasearch(process.env.ALGOLIA_ID, process.env.ALGOLIA_ADMIN_KEY);

export default stitchSchemas({
    resolvers,
    subschemas: [{schema: feedsSchema}],
    typeDefs,
});

export const dataSources = () => ({
    search: {
        posts: algolia.initIndex('POSTS'),
    }    
});