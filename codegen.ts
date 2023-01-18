import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
  schema: 'schema.graphql',
  documents: [
    // 'src/**/*.svelte',
    'src/gql/queries/*.ts',
  ],
  // ignoreNoDocuments: true,
  generates: {
    'src/gql/': {
      preset: 'gql-tag-operations-preset',
      plugins: ['graphql-scalar-locations'],
      // config : {scalars: ['DateTime']}
        // 'typescript',
        // 'typescript-operations',
      // ]
    }
  },
  verbose: true,
  debug: true,
}
export default config
