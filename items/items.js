function get_items(barcode){

    var item = new Array();
    
    item['0001'] = new Array('Nescafe - Cappucino - 25g',           '10');
    item['0002'] = new Array('Head&Shoulder - Cool Melthol - 12ml', '8');
    item['0003'] = new Array('Rexona - Pasion - 25ml',              '50');
    item['0004'] = new Array('Superstix - Wafer Sticks - 402g',     '125');
    item['0005'] = new Array('Star Margarine - Chocolate - 15g',    '5.50');
    item['0006'] = new Array('Magnolia - Cheezee Spread - 15g',     '5.50');
    item['0007'] = new Array('Nestle Milo - 24g',                   '7.50');
    item['0008'] = new Array('Energen Chocolate - 30g',             '8.50');
    item['0009'] = new Array('Nescafe Original - 25g',              '8.50');


    //console.log(barcode);
    var item_search = new Array();
    var item_found = new Array();
    for(var item_search in item){
        if(item_search == barcode) { item_found = item[barcode];}
    }
    
    if (item_found.length >0){
        return item_found;
    }
    else{
        return false;
    }
}