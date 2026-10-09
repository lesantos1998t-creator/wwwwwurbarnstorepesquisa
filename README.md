# Urban Store — pesquisa acadêmica

O site guarda os novos envios dos três formulários no Netlify Database, usando uma função do servidor. Os dados não ficam no navegador nem em arquivos públicos do site.

## Onde encontrar os dados

No painel do projeto na Netlify, acesse **Data & Storage > Database**. Selecione o banco da publicação de produção para consultar os envios do site público, ou o banco do deploy preview para consultar os testes daquela versão. O editor do banco permite visualizar as tabelas:

- `registrations`: nome, faixa etária, gênero, e-mail, endereço, número da casa, quatro consentimentos, versão dos termos e data de envio.
- `ratings`: produto avaliado, nota de 1 a 5 estrelas, comentário e data de envio.
- `feedback`: e-mail, mensagem e data de envio.

O acesso deve ficar restrito aos responsáveis pela pesquisa com permissão no projeto. A API pública aceita apenas envio e não oferece listagem de dados pessoais. As avaliações são independentes dos cadastros, como no formulário original; não há identificação automática do autor.

As tabelas serão criadas pela migração na publicação do projeto. Os formulários mostram sucesso somente depois da confirmação do banco; em caso de falha, preservam os campos para uma nova tentativa. Cada envio confirmado gera um novo registro.

A versão anterior era demonstrativa e não guardava as informações preenchidas. Esses preenchimentos anteriores não podem ser recuperados por esta alteração: o armazenamento começa com os novos envios após a publicação.

## Manutenção

Instale as dependências com `npm ci`. Para verificar os tipos, use `npm run typecheck`; para verificar o JavaScript do navegador, use `node --check script.js`.

O esquema está em `db/schema.ts`. Antes de alterar as tabelas, consulte `netlify db status`; depois gere uma nova migração com `npx drizzle-kit generate --name descricao_da_alteracao`. As migrações ficam em `netlify/database/migrations` e são aplicadas pela Netlify na publicação. Não altere migrações já aplicadas.

Os responsáveis pela pesquisa devem disponibilizar seu contato, definir o prazo de retenção e atender aos pedidos de acesso, correção, exclusão e revogação mencionados no site. Não compartilhe os registros ou credenciais do banco publicamente.
