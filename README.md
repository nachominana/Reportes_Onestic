> Ignacio Miñana Esteve 
# **REPORTES PARA ONESTIC**


- [Introducción](#Introducción)
- [Reporte 1](#Reporte-1)
- [Reporte 2](#Reporte-2)
- [Reporte 3](#Reporte-3)
- [Como ejecutar el programa](#Como-eejecutar-el-programa)

## **Introducción**
En esta pequeña memoria comento los pasos realizados para completar los tres reportes partiendo de tres ficheros csv como son `orders.csv` `products.csv` y `customers.csv`. A modo de resumen se presentan los objetivos de los reportes:
1. **Reporte 1:** Generar un archivo csv `order_prices.csv` que contenga el id del pedido y el precio de la compra
2. **Reporte 2:** Generar un archivo csv `product_customer.csv` que contenga el id del producto junto con todos los customers que lo han comprado
3. **Reporte 3:** Generar un archivo csv `customer_ranking.csv` que contenga el el dinero total que se ha gastado cada customer ordenado de manera descendente repecto del dienero gastado.

Para la realizacion de este peuqeño programa he utilizado javascript y finalmente he creado un pequeño fichero DockerFile para poder ejecutarlo con Docker.

Antes de comentar como he abordado cada reporte, es importante destacar la necesidad de crear algún tipo de estructura con la cual poder trabajar los datos. En mi caso, he decidido crear por cada archivo necesario un Array de objetos del tipo nombre del archivo con el cual poder accedar a sus propiedades, por ejemplo para `customers.csv` he creado el array `customers` donde cada customer tiene su `id`, `firstname`, `lastname`.

## **Reporte 1**

Para realizar el reporte 1 he tenido que por cada producto de cada orden obtener el precio de dicho producto. Para ello he creado una función `totalOrdenPedido` que calcula el precio total de un pedido con la ayuda de la función `precioProducto` que calcula  el precio de un producto.

```
function totalOrdenPedido(orden){ // Calcula el precio total de un pedido como parametro 
    let precioDePedido = 0
    for(let i = 0; i < orden.products.length; i++){
        let productoid = orden.products[i]
        precioDePedido += parseFloat(precioProducto(productoid))
    }
    return precioDePedido
}
```
Una vez ya tenemos los datos necesarios es tan sencillo como crear la cadena de carácteres que representará al fichero `order_prices.csv` y escribir dentro de el la cadena.

## **Reporte 2**

En cuanto al reporte 2 es parecido al primer reporte. En este caso necesitamos saber que customers han comprado dicho producto y guardarlo en un array para luego poder insertarlo en el fichero resultado, para ello con la función `ventasDelProducto` obtenemos dicho resultado, fijandonos bien en que los datos no esten repetidos.

```
function ventasDelProducto(id){ // Retorna una array con el id de los customers que han comprado ese producto
    let ventas = []
    orders.forEach((orden) =>{
        if(orden.products.includes(id) && !ventas.includes(orden.customer)){ventas.push(orden.customer)}
    })
    
    return ventas
}
```
Al igual que con el reporte anterior, creamos la cadena de caráteres y la insertamos en el fichero `product_customer.csv`.
## **Reporte 3**
Para realizar el reporte 3 al haber creado distintas funciones para el reporte 1 hemos podido reutiliar algunas de ellas. Para ello, primero hay que calcular el precio que se ha gastado un customer, que esto nos lo permite hacer la función `totalCliente`, que utiliza `totalOrdenPedido` para saber el precio de la orden del pedido.

```
function totalCliente(id){  
    let total = 0 
    orders.forEach((order) =>{ // Calcula el dinero que se ha gastado un cliente pasado por parametro
         if(order.customer == id){total += totalOrdenPedido(order)}
    })
    return total.toString()
 }
```

Además, creamos una copia de la estructura de customer para poder modificarla añadiendole la propiedad `total`, que indica el dinero total que se ha gastado, a cada customer. Segudamente, hay que ordenar la estructura según el dinero gastado de manera descendente y por último al igual que en los otros reportes crear y escribir en el fichero  `customer_ranking.csv`.

## **Como ejecutar el programa**
Para poder ejecutar el programa es tan fácil como seguir estos pasos:
1. Descargarse Docker 
2. Descargarse la carpeta src del repositorio
3. Abrir un terminal dentro de la carpeta src
4. Ejecutar el fichero DockerFile para que se ejecute en un contenedor de Docker 