# Consultoria de Imagem Castilho - Website

Este é o site responsivo para a Consultoria de Imagem Castilho, desenvolvido com HTML5, CSS3 e JavaScript puro.

## Estrutura do Projeto

```
.
├── index.html          # Página principal
├── css/
│   └── style.css      # Estilos principais
├── js/
│   └── script.js      # Funcionalidades JavaScript
└── images/
    └── portfolio/     # Imagens do portfólio
```

## Características

- Design responsivo que funciona em todos os dispositivos
- Navegação suave entre seções
- Galeria de portfólio interativa
- Formulário de contato funcional
- Animações suaves
- Código limpo e bem organizado

## Personalização

### Cores
As cores principais podem ser alteradas no arquivo `css/style.css` nas variáveis CSS na raiz:

```css
:root {
    --primary-color: #8B5A2B;   /* Marrom principal */
    --secondary-color: #D4AF8C; /* Bege claro */
    --accent-color: #A67C52;   /* Marrom médio */
    --text-color: #333333;     /* Cor do texto */
    --light-text: #ffffff;     /* Texto claro */
    --background-light: #F5F5F0; /* Fundo claro */
    --background-dark: #2C2C2C;  /* Fundo escuro */
}
```

### Imagens
As imagens do portfólio devem ser adicionadas na pasta `images/portfolio/`. O JavaScript irá carregá-las automaticamente.

### Conteúdo
O conteúdo do site pode ser editado diretamente no arquivo `index.html`.

## Como Usar

1. Faça o download ou clone este repositório
2. Abra o arquivo `index.html` em um navegador web
3. Para publicar, faça upload dos arquivos para seu servidor web

## Requisitos

Nenhum requisito especial, apenas um navegador web moderno.

## Licença

Este projeto está licenciado sob a licença MIT.
