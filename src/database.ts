const produtos: {
  nome: string;
  estoque: number;
}[] = [
  { nome: "Pão integral", estoque: 12 },
  { nome: "Ovos", estoque: 30 },
  { nome: "Iogurte natural", estoque: 0 },
  { nome: "Banana", estoque: 18 },
  { nome: "Aveia", estoque: 0 },
  { nome: "Leite desnatado", estoque: 10 },
  { nome: "Presunto", estoque: 5 },
  { nome: "Manteiga", estoque: 0 },
  { nome: "Café", estoque: 20 },
  { nome: "Queijo branco", estoque: 7 },
  { nome: "Maçã", estoque: 14 },
  { nome: "Geleia de morango", estoque: 0 },
  { nome: "Tapioca", estoque: 9 },
  { nome: "Suco de laranja", estoque: 11 },
  { nome: "Granola", estoque: 3 },
  { nome: "Pão francês", estoque: 0 },
  { nome: "Requeijão", estoque: 6 },
  { nome: "Leite vegetal", estoque: 4 },
  { nome: "Mel", estoque: 2 },
  { nome: "Castanha-do-pará", estoque: 0 },
];

export const produtosEmEstoque = () => {
  return produtos.filter((produtos) => produtos.estoque > 0);
};

export const produtosEmFalta = () => {
  return produtos.filter((produtos) => produtos.estoque === 0);
};
