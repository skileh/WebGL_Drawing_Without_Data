## Requisitos

- [NodeJS](https://nodejs.org/)

## Bibliotecas utilizadas

- [dat.GUI](https://github.com/dataarts/dat.gui)
- [P5 Sound](https://p5js.org/reference/#/libraries/p5.sound)
- [Webgl](https://webglfundamentals.org/)
- 
## Rodar o projeto

Para rodar o trabalho entre na pasta do projeto e rode no terminal `npx live-server`.

## Detalhes da implementação

Parte de minha implementação foi baseada no tutorial desenvolvido pela [Webgl Fundamentals](https://webglfundamentals.org/webgl/lessons/webgl-drawing-without-data.html).
A proposta deste projeto é desenhar diversos objetos em tela sem uso de dados. Todos objetos impressos, calculos de posição e atributos do tipo são feitos no vertex shader, inclusive é ele quem informa ao fragment shader que pixels e que cores serão pintados, também no fragment shader é estipulado o tamanho do pixel, para dar uma percepção de 3d (embora seja tudo 2d). 
Para o som, a biblioteca p5sound foi muito util, com ela é possível armazenar em um vetor todos os picos de amplitude contidos no som. Selecionei os picos mais altos de frequencia da musica, a cada pico de frequencia parte dos pixels mudam de posição repentinamente e também dependendo do grau de intencidade da frequencia é estipulada uma cor para os objetos em cena. Talvez minha explicação pareça um pouco confusa, mas observando o código certamente isto se tornará mais claro.

Veja o gif a seguir para melhor compreender (:

![](webglgif.gif)
