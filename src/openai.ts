import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources";
import { z } from "zod";
import { produtosEmEstoque, produtosEmFalta } from "./database";

const schema = z.object({
  produtos: z.array(z.string()),
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "produtos_em_estoque",
      description: "Lista os produtos que estão em estoque.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      strict: true,
    },
  },
  {
    type: "function",
    function: {
      name: "produtos_em_falta",
      description: "Lista os produtos que estão em falta.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      strict: true,
    },
  },
];

export const generateProducts = async (message: string) => {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `Liste três produtos que atendam à necessidade do usuário. Considere apenas os produtos em estoque.`,
    },
    {
      role: "user",
      content: message,
    },
  ];

  const completion = await client.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    max_tokens: 100,
    response_format: zodResponseFormat(schema, "produtos_schema"),
    tools,
    messages,
  });

  const choice = completion.choices[0].message;

  if (choice.refusal) {
    throw new Error("Refusal");
  }

  // Se a IA solicitou chamar uma função (tool call)
  if (choice.tool_calls?.length) {
    const [tool_call] = choice.tool_calls;

    const toolsMap = {
      produtos_em_estoque: produtosEmEstoque,
      produtos_em_falta: produtosEmFalta,
    };

    const toolName = tool_call.function?.name;

    if (!toolName || !(toolName in toolsMap)) {
      throw new Error("Function not found");
    }

    // Como suas funções não esperam argumentos, chame sem nenhum
    const functionToCall = toolsMap[toolName as keyof typeof toolsMap];
    const result = functionToCall();

    // Retorne no formato esperado
    return { produtos: result.map(p => p.nome).slice(0, 3) }; // apenas os nomes dos 3 primeiros produtos
  }

  // Caso a IA já tenha retornado o resultado via parsing direto
  return choice.parsed;
};

