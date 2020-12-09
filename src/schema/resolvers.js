import { schema as streamFeeds } from '@stream-io/graphql-feeds';
import { delegateToSchema } from 'apollo-server';

export const resolvers = {
	Mutation: {
        createPost: {
            resolve: async (source, args, context, info) => {
                try {
                    const { dataSources } = context;
                    const { user_id } = context.auth;

                    if (!user_id) {
                        throw new Error(
                            'UNAUTHORIZED: Please generate a stream token and make sure the Authorization header includes it as a Bearer token.'
                        );
                    }

                    // Take the data argument, add the user id for reference and create a collection entry using the feeds schema.
                    const entry = await context.stream.feeds.collections.add('posts', null, {
                        ...args.data,
                        user: user_id,
                    });

                    const activity = {
                        actor: user_id,
                        object: `posts:${entry.id}`,
                        verb: 'post',
                    };

                    const result = await delegateToSchema({
                        args: {
                            activity,
                            feed: `posts:${user_id}`,
                        },
                        context,
                        fieldName: 'addActivity',
                        info,
                        operation: 'mutation',
                        schema: streamFeeds,
                    });

                    // Here we store just enough data to allow filtering, faceting and text-based search in algolia.
                    await dataSources.search.posts.saveObject({
                        feedID: `posts:${user_id}`,
                        feedSlug: 'posts',
                        objectID: result.id,
                        text: args.data.text,
                        userID: user_id,
                    });

                    return result;
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error(error);

                    return null;
                }
            },
        },
    },
    Query: {
	    searchPosts: {
	        resolve: (source, args, context) => {
	            const { posts } = context.dataSources.search;

	            return posts.search(args.query, {
	                attributesToRetrieve: ['objectID'],
	            });
	        },
	    },
    },
    SearchResponse: {
        hits: async (source, _, { stream }) => {
            try {
                const ids = source.hits?.map?.(({ objectID }) => objectID) || [];

                if (ids?.length) {
                    // batch get activities by id based on the algolia results.
                    const { results } = await stream.feeds.getActivities({ ids });

                    return results || [];
                }

                return null;
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error.message);

                return null;
            }
        },
    },
    StreamFlatFeed: {
      search: {
          resolve: (source, args, context) => {
              const { posts } = context.dataSources.search;

              return posts.search(args.query, {
                  attributesToRetrieve: ['objectID'],
                  filters: `feedID:"${source.id}"`,
              });
          },
      },
  },
};