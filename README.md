# uCondo - hands on

- Clone repo 
> `git clone git@github.com:ronaldosantos1001/uCondo-app.git` 
- Install dependencies
> `yarn`
- Run
> `yarn android` or `yarn ios`

 ##

# MISSÃO

O app deve permitir inclusão, edição e exclusão de registros, sendo
estes salvos no próprio device (sem backend).

# REGRAS

A tela de cadastro deve permitir selecionar a conta pai e ao fazer isso você deve
automaticamente sugerir o código da filha que será cadastrada (Ex.: Criando uma
conta filha de “2.2” você irá sugerir o código “2.2.8” se a maior filha for a “2.2.7”.
Sempre use a lógica do maior + 1)

● O código deverá ser sugerido a pessoa usuária mas ela pode atualizar conforme
sua necessidade

● A conta que aceita lançamentos não pode ter filhas

● A conta que não aceita lançamento pode ser pai de outras contas

● Os códigos não podem se repetir

● As contas devem, obrigatoriamente, ser do mesmo tipo que seu pai quando este
for informado

● O maior código possível é “999” independente do nível que você está. Então o
código “9.9.999” é um código válido e “9.9.1000” não

● Se você já possui o código “9.9.999” e precisa criar mais uma filha da conta “9.9”
você deverá: alterar o pai informado para “9” e sugerir o próximo código válido

● Se atente para criar uma lógica que consiga sugerir o novo pai "9" com o próximo
filho "9.11" caso você tente buscar um código para o pai “9.9.999.999” .

 ##

<p align="center">
    <img src="assets\01.png"/>
</p>

##
