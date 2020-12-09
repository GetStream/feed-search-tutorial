import { gql } from 'apollo-server';

export const typeDefs = gql`
    # Posts
    type Post {
        image: String
        text: String!
        user: StreamUser!
    }

	input CreatePostInput {
        image: String
        text: String!
    }

	# Users
    extend type StreamUser {
        name: String!
    }

    # Search 
    type SearchResponse {
        hits: [StreamActivity!] # This is the interesting part.
        nbHits: Int!
        nbPages: Int!
        hitsPerPage: Int!
        exhaustiveNbHits: Boolean!
        query: String!
        params: String!
    }

    extend type StreamFlatFeed {
        """
        Custom field added to the StreamFlatFeed type to add search functionality.
        """
        search(query: String!): SearchResponse!
    }

    # Resolvers
    type Query {
        searchPosts(query: String!): SearchResponse!
    }

	type Mutation {
        createPost(data: CreatePostInput!): StreamActivity!
    }
`;