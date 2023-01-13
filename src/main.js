

/***********************************
*        CONSTANTES                *
************************************/

const customers = []
const orders = []
const products = []
const order_prices = []
var orders2 = []
const fs = require("fs"); 

/***********************************
*         FUNCIONES                *
************************************/

 function crearEstructuraCustomers(fichero){ // Crea un Array de objetos tipo Customers
    let datos = fs.readFileSync(fichero).toString()   
    rows = datos.split("\r\n")       // Dividimos los datos por filas 
    idColumns = rows[0].split(",")   // Cojemos los identificadores de las columnas
    elementos = rows.slice(1,-1)     // Cojemos el resto de elementos que representan los datos
    elementos.forEach((elemento) =>{ // Para cada elemento creamos un objeto que lo representa con sus propiedades
        let customer = {}
        let promiedades = elemento.split(",")
        for(var i = 0; i < idColumns.length; i++){
            let propiedad = promiedades[i]
            customer[idColumns[i]] = propiedad
        }
        customers.push(customer)    // Finalmente los insertamos en el array de objetos 
    })
}

 function crearEstructuraOrders(fichero){ // Crea un Array de objetos tipo Orders
    let datos =  fs.readFileSync(fichero).toString()
    rows = datos.split("\r\n")       
    idColumns = rows[0].split(",")   
    elementos = rows.slice(1,-1)
    elementos.forEach((elemento,index) =>{
        let order = {}
        let promiedades = elemento.split(",")
        for(var i = 0; i < idColumns.length; i++){
            let propiedad = promiedades[i]
            if (i == 2){
                let products = propiedad.split(" ")
                order[idColumns[i]] = products
            }else{
                order[idColumns[i]] =  propiedad
            }
            
        }
        orders.push(order)
    })
    
}

 function crearEstructuraProducts(fichero){ // Crea un Array de objetos tipo Products
    let datos =  fs.readFileSync(fichero).toString()
    rows = datos.split("\r\n")       
    idColumns = rows[0].split(",")   
    elementos = rows.slice(1,-1)
    elementos.forEach((elemento,index) =>{
        let product = {}
        let promiedades = elemento.split(",")
        for(var i = 0; i < idColumns.length; i++){
            let propiedad = promiedades[i]
            product[idColumns[i]] = propiedad
        }
        products.push(product)
    })
    
} 
function validarFicheros(indexs,args,ns){ // Valida que los ficheros existen en el directorio antes de leerlos 
    let fallo = false
    for(let i = 0; i < 3; i++){
        if(indexs[i] == -1 && !fs.existsSync(args[indexs[i]])){
            console.log("Archivo: "+ ns[i] + " no encontrado")
            fallo = true;
        }
        
    }
    return !fallo
}
function escribirEnFichero(nombrefichero,fichero){ // Escribe en un arrchivo de nombre el primer parametro los datos que aparecen en el segundo parametro
    fs.writeFileSync(nombrefichero,fichero,(err) =>{
        if(err){console.log(err)}
   })
}

function totalOrdenPedido(orden){ // Calcula el precio total de un pedido como parametro 
    let precioDePedido = 0
    for(let i = 0; i < orden.products.length; i++){
        let productoid = orden.products[i]
        precioDePedido += parseFloat(precioProducto(productoid))
    }
    return precioDePedido
}
function precioProducto(id){ // Retorna el valor de un producto pasandole el id
    return products[id].cost
}
function ventasDelProducto(id){ // Retorna una array con el id de los customers que han comprado ese producto
    let ventas = []
    orders.forEach((orden) =>{
        if(orden.products.includes(id) && !ventas.includes(orden.customer)){ventas.push(orden.customer)}
    })
    
    return ventas
}
function totalCliente(id){ // Calcula el dinero que se ha gastado un cliente pasado por parametro 
    let total = 0 
    orders.forEach((order) =>{
         if(order.customer == id){total += totalOrdenPedido(order)}
    })
    return total.toString()
 }

function reporte1(){
    let fichero = "id,total\r\n"
    orders.forEach((order) =>{ // Para cada orden calculamos el precio de la compra a la vez que  vamos creado el archivo order_prices.csv
         let row = "" + order.id + "," + totalOrdenPedido(order) + "\r\n"
         fichero += row
 
    })  
    escribirEnFichero("order_prices.csv",fichero)
    console.log("Archivo order_prices.csv creado corectamente")
 }
function reporte2(){
    let fichero = "id,customer_ids\r\n"
    products.forEach((product) =>{
        let customer_ids = ventasDelProducto(product.id).toString().replace(/,/g, " ")
        let row = "" + product.id + "," + customer_ids + "\r\n"
        fichero += row
    })
    escribirEnFichero("product_customers.csv",fichero)
    console.log("Archivo product_customers.csv creado corectamente")

}
function reporte3(){
    let customers2 = customers
    customers2.forEach((customer) =>{ // Añadimos a cada customer el precio gastado 
        customer["total"] = totalCliente(customer.id)        
    })
    customers2.sort((a,b) =>{ // Ordenamos segun el dinero gastado 
        if(parseFloat(a.total) > parseFloat(b.total)){return -1}
        if(parseFloat(a.total) < parseFloat(b.total)){return 1}
        return 0
    })
    let fichero = "id,name,lastname,total\r\n"
    customers2.forEach((customer) =>{ // Finalmente creamos el fichero con sus columnas
      if(customer.total != "0"){
            let row = customer.id + "," + customer.firstname + ","  + customer.lastname + ","  + customer.total + "\r\n"
            fichero += row
      }         
    })
    escribirEnFichero("customer_ranking.csv",fichero)
    console.log("Archivo customer_ranking.csv creado corectamente")
}

/***********************************
*         PROGRAMA PRICIPAL        *
************************************/

if (process.argv.length >= 5){
    argv = process.argv
    nombres = ["orders.csv","customers.csv","products.csv"]    
    indexficheros = [process.argv.indexOf(nombres[0]), process.argv.indexOf(nombres[1]) ,process.argv.indexOf(nombres[2])]
    try{
        if(validarFicheros(indexficheros,argv,nombres)){
            argv.forEach((dato) =>{ // Creamos por cada fichero su corespondiente estructura
                switch (dato){
                    case nombres[0]:
                        crearEstructuraOrders(dato)
                        break
                    case nombres[1]:
                        crearEstructuraCustomers(dato)
                        break
                    case nombres[2]:
                        crearEstructuraProducts(dato)
                        break
                    default:
                        break
                }
            })
        }
        //Ejecutamos los tres reportes
        reporte1()
        reporte2()
        reporte3()
        
        
        
    }catch(err){console.log(err)}

}else{
    console.log("Falta algun fichero: orders.csv, products.csv o customers.csv")
} 








