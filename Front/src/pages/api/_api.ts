// import type { APIRoute } from 'astro';
// import * as operations from '../../services/index.js';

// /* Map REST API endpoints to internal operations
//   (GETs only for illustration purpose) */
// export const endpointsToOperations = {
// 	products: operations.getProducts,
// 	users: operations.getUsers,
// };

// function parseTypeParam(endpoint: string | undefined) {
// 	if (!endpoint || !(endpoint in endpointsToOperations)) return undefined;
// 	return endpoint as keyof typeof endpointsToOperations;
// }

// /* Controllers */

// export const get: APIRoute = ({ params /* , request */ }) => {
// 	console.log('Hit!', params.entity);

// 	const operationName = parseTypeParam(params.entity);

// 	if (!operationName) return new Response('404', { status: 404 });

// 	const body = endpointsToOperations[operationName]();

// 	return new Response(JSON.stringify(body), {
// 		status: 200,
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 	});
// };

// /* ... */

// /* Astro's static build helper, can be removed for SSR mode */
// export function getStaticPaths() {
// 	return Object.keys(endpointsToOperations).map((endpoint) => ({
// 		params: { entity: endpoint },
// 	}));
// }



import type { APIRoute } from 'astro';
export const prerender = false;


// Mock de dados
const mockProducts = [
  { id: 1, name: "Product 1", price: 10.99 },
  { id: 2, name: "Product 2", price: 20.50 },
];

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

// Funções que retornam dados mockados
export const getProducts = () => mockProducts;
export const getUsers = () => mockUsers;

// Mapeia endpoints para funções de mock (agora está exportado)

function parseTypeParam(endpoint: string | undefined) {
  if (!endpoint || !(endpoint in endpointsToOperations)) return undefined;
  return endpoint as keyof typeof endpointsToOperations;
}

// Rota de API para GET
export const get: APIRoute = ({ params }) => {
  console.log('Hit API:', params.entity);

  const operationName = parseTypeParam(params.entity);

  if (!operationName) {
    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404 });
  }

  const body = endpointsToOperations[operationName]();

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Criar rotas estáticas para build SSG
export function getStaticPaths() {
  return Object.keys(endpointsToOperations).map((endpoint) => ({
    params: { entity: endpoint },
  }));
}

export const endpointsToOperations = {
	products: () => [{ id: 1, name: "Sample Product" }], // Mock data
	users: () => [{ id: 1, name: "John Doe", email: "john@example.com" }], // Mock data
  };