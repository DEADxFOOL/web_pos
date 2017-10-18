var item_number = 1;
var description_open = false;
var cashout_open = false;

$(function(){
    date_time('date_time');

    var oTable = $('#table_id').dataTable( {
        "sScrollY": //'100px', 
        calcDataTableHeight(),
        //"sScrollX": "100%",
        //"sScrollXInner": "100%",
        "bScrollCollapse": true,
        "bPaginate": false,
        "bFilter": false,
        "bAutoWidth": true,
        "aoColumns": [
                { "sWidth": "10%" }, 
                { "sWidth": "50%" },
                { "sWidth": "10%" }, 
                { "sWidth": "10%" },
                { "sWidth": "10%" },
                { "bVisible": false }
        ]
        
    } );
    
    //new $.fn.dataTable.FixedColumns( oTable,{"iLeftColumns": 1} );
    
    $('.dataTable thead th').each(function(){
        var inner_text = $(this).html();
        $(this).html('');
        var html_text = "<div style='margin-left:5px;' class='header_content'><span>"+inner_text+"</span></div>";
        $(this).append(html_text);
    });
    resizefont();
    $('.dataTables_scrollHeadInner table th').eq(0).click();
    $('.dataTables_scrollHeadInner table th').eq(0).click();
    
    $('#barcode_input').focus();
    listener();
    //center_description();
    center_cashout();

});


function center_cashout(){

    var total_cash = parseFloat($('#php_total span').html());
    

    if(total_cash == 0) return;
    
    var center_w = (($(window).width())/2) - ($('#confirm_transaction').width()/2);
    var center_t = (($(window).height())/2) - ($('#confirm_transaction').height()/2);
    
    $('#C_change').html('--');
    $('#cashout_amount').val('');
    
    $('#desc_close_x').css({
        'left':'97%',
        'top':'-2%'
    });
    
   
    $('#confirm_transaction').css({
        'left':center_w+'px',
        'top':center_t+'px'
    });
    
    $('#blocker').css({
        'display':'block',
        'top':'0px',
        'left':'0px'
    });
    $('#cashout_amount').focus();
    
    $('#payable').html($('#php_total span').html());

    cashout_open = true;
}


function center_description(){

    var center_w = (($(window).width())/2) - ($('#Item_description').width()/2);
    var center_t = (($(window).height())/2) - ($('#Item_description').height()/2);
    
    $('#desc_close').css({
        'left':'97%',
        'top':'-3%'
    });
    
   
    $('#Item_description').css({
        'left':center_w+'px',
        'top':center_t+'px'
    });
    
    $('#blocker').css({
        'display':'block',
        'top':'0px',
        'left':'0px'
    });
    $("#I_qty_text_val_hid").val('');
    description_open = true;
}


function listener(){
    
    
    /* ==========on change cash tendered =========== */
    
    $('#cashout_amount').keyup(function(){
        
        $('#C_change').html('');
        
        var payable = parseFloat($('#payable').html());
        
        var tendered = parseFloat($('#cashout_amount').val());
        var change = tendered - payable;
        if(change > 0){
            $('#C_change').html(parseFloat(change).toFixed(2));
        } else{
            $('#C_change').html('--');
        }
        
    });
    
    /* ============= on keypad press ====================== */
    
    $('.number_keys').click(function(){
        var bttn_id = $(this).attr('id');
        
        $('#barcode_input').focus();


        var barcode_val = $('#barcode_input').val();

        
        if(bttn_id == 'dot') return;
        
        if(bttn_id == 'enter') {
            center_cashout();
            return;
        }
        
        if(bttn_id == 'clr'){
            barcode_val= barcode_val.substring(0, barcode_val.length - 1);
            $('#barcode_input').val(barcode_val);
            return;
        }
        
        

        bttn_id = bttn_id.split('n')[1];

        $('#barcode_input').val(barcode_val + bttn_id);
        barcode_change();
    
    });
    
    
    /* ============== get element on click data table  ============= */
    
    oTable = $('#table_id').dataTable();
    
    
    $("#table_id tbody").click(function(event) {
        
        nTr = event.target.parentNode;
        var lnth = oTable.fnSettings().aoData.length;
        
        while ( nTr ){
            if ( nTr.nodeName == "TR" ) break;
            nTr = nTr.parentNode;
        }
        if(lnth == 0){ return}
        
        var iPos= oTable.fnGetPosition(nTr);
        var data = oTable.fnGetData(nTr);
        update_total(data[2],data[4],'subtract');
        oTable.fnDeleteRow(iPos);
        update_total_amount();
    });



    /* ==remove red border on quantity === */
    $('#I_qty_key_holder').click(function(){
       $('#I_qty_text_holder').css({
           'border':'1px solid #CCCCCC'
       });
    });
    
    /* =============== hidden quantity numbers only ============= */
    $("#I_qty_text_val_hid").keydown(function (e) {
        if ($.inArray(e.keyCode, [46, 8, 27, 13]) !== -1) { return; }

        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
    
    /* =============== hidden quantity update to visible quantity ============= */
    $("#I_qty_text_val_hid").keyup(function(e){
        if((description_open==true)){
            $("#I_qty_text_val").html(parseInt($("#I_qty_text_val_hid").val()));
        }
        if((description_open==true) && ($("#I_qty_text_val_hid").val() == '')){
            $("#I_qty_text_val").html('0');
        }
    });
    

    /* =============== bracode scan ============= */
    $('#barcode_input').keyup(function(){
        barcode_change();
    });
    
    
    $('#I_confirm').click(function(){
        confirm_item();
    });
    
    
    /* ==== desc close bttn clicked ==== */
    $('#desc_close').click(function(){
        if(description_open){ close_item_desc(); }  
    });
    
    /* ==== cashout close bttn clicked ==== */
    $('#desc_close_x').click(function(){
        if(cashout_open){ close_cashout(); }  
    });
    
    
    /* ======== keydown event ============== */
    $(document).on('keydown', function(e) {
        
        
        if(description_open){
                $('#I_qty_text_val_hid').focus();
        }
        
        //enter key
        if(e.which == 13){
            //item_descript is open
            if(description_open){ confirm_item(); return ;}
            if(cashout_open == false){  center_cashout(); return; }
            if(cashout_open){  cashout_trn(); return; }
          
        }

        //esc key
        if(e.which == 27){
            if(description_open){ close_item_desc(); return;}
            if(cashout_open)    { close_cashout(); return;}
        }
        
        //key up
        if(e.which == 38){
            if(description_open){ add_number_item(); return;}
        }
        
        //key down
        if(e.which == 40){
            if(description_open){ sub_number_item(); return;}
        }
    });
    
    /* ============== descripttio key up and down ================= */
    $('#keyup').click(function(){
        if(description_open){ add_number_item(); }
        
    });
    
    $('#keydown').click(function(){
        if(description_open){ sub_number_item(); }
    });
    
    $('#C_confirm').click(function(){
        if(cashout_open){ close_cashout(); return;}
    });
    
    

}


function cashout_trn(){
    
    if($('#C_change').html() == '--'){
        return;
    }
    
    $('#change span').html(parseFloat($('#C_change').html()).toFixed(2));
    $('#qty span').html('0');
    $('#items_qty span').html('0');
    $('#php_total span').html('0');
    
    

    var oTable = $('#table_id').dataTable();
    oTable.fnClearTable();
    item_number = 1;
    close_cashout(); 
}

function barcode_change(){

    var items = new Array();
    items = get_items($('#barcode_input').val());

    if(items.length == 2){
        barcode_input
        $('#I_found_barcode').html($('#barcode_input').val());
        $('#barcode_input').val('');
        $('#I_qty_text_val').html('0');
        $('#I_qty_text_val_hid').focus();

        $('#I_found_desc').html(items[0]);
        $('#I_found_price').html(items[1]);
        center_description();
    }
   
}

function add_number_item(){
    if(description_open){
            var qty = $('#I_qty_text_val').html();
            qty++;
            if(qty==999){return;}
            $('#I_qty_text_val').html(qty);
            $("#I_qty_text_val_hid").val(qty);
        }
}

function sub_number_item(){
        if(description_open){
            var qty = $('#I_qty_text_val').html();
            qty--;
            if(qty < 0){return;}
            $('#I_qty_text_val').html(qty);
            $("#I_qty_text_val_hid").val(qty);
        }   
}


function close_item_desc(){
    $('#blocker').css({
        'display':'none',
        'top':'1000px',
        'left':'1000px'
    });

    $('#Item_description, #desc_close').css({
        'left':'10000px',
        'top':'10000px'
    });
    

    $('#I_found_desc, #I_found_price, #I_qty_text_holder').css({
        'border':'1px solid #CCCCCC'
    });
    $('#I_qty_text_val_hid').val('');
    $('#barcode_input').focus();
    
    $('#I_found_desc').html('');
    $('#I_found_price').html('');
    
    description_open = false; 
    $('#barcode_input').val('');

}


function close_cashout(){
    $('#blocker').css({
        'display':'none',
        'top':'1000px',
        'left':'1000px'
    });

    $('#confirm_transaction, #desc_close_x').css({
        'left':'10000px',
        'top':'10000px'
    });
    $('#barcode_input').focus();
    cashout_open = false; 
}


function confirm_item(){
    
    var items= new Array();
    var new_item= new Array();
    items[0] = $('#I_found_desc').html();
    items[1] = $('#I_found_price').html();

    if($('#I_found_desc').html() == '') {
        $('#I_found_desc').css({
            'border':'1px solid #CE5052'
        });
        return false;
    }
    if($('#I_found_price').html() == '') {
        $('#I_found_price').css({
            'border':'1px solid #CE5052'
        });
        return false;
    }
    if($('#I_qty_text_val').html() == 0 || $('#I_qty_text_val').html() == '') {
        $('#I_qty_text_holder').css({
            'border':'1px solid #CE5052'
        });
        return false;
    }

    var quant = $('#I_qty_text_val').html();
    new_item[0]=items[0];
    new_item[1]=quant;
    new_item[2]=parseFloat(items[1]).toFixed(2);
    new_item[3]= parseFloat(quant * items[1]).toFixed(2);
    new_item[4]=$('#I_found_barcode').html();
    

    description_open = false; 
    $('#barcode_input').val('');
    
    close_item_desc();
    add_item(new_item);

}


function add_item(items){
    
    var item_found = search_duplicate(items[4]);
    console.log(item_found);
    
    
    if(item_found == false){
        $('#table_id').dataTable().fnAddData( [
            item_number,
            items[0],
            items[1],
            items[2],
            items[3],
            items[4]]
            
        );
        item_number++;
    } else{
        console.log(item_found[0]);
        var total = parseFloat(items[3]) + parseFloat((item_found[2] * item_found[3]));
        var oTable = $('#table_id').dataTable();
        oTable.fnUpdate( parseFloat(total).toFixed(2), (item_found[0]-1), 4);
        oTable.fnUpdate( parseFloat(total).toFixed(2), (item_found[0]-1), 4);
        /*
        oTable.fnUpdate( 'edit', item_found-1, 2);
        oTable.fnUpdate( 'edit', item_found-1, 2);
        oTable.fnUpdate( 'edit', item_found-1, 2);
        */
    }

    
    
    update_total(items[1],items[3],'add');
    
    $('#table_id').dataTable().fnDraw();
    $('#barcode_input').val('');
    $('#barcode_input').focus();
}

function update_total(qty,amount,operation){
    
    var  current_t = parseFloat($('#php_total span').html());
    var  current_qty = parseInt($('#qty span').html());
    
    
    
    if(operation == 'add'){
        current_t = current_t + parseFloat(amount);
        current_qty = current_qty + parseInt(qty);
    }
    if(operation =='subtract'){
        current_t = current_t - parseFloat(amount);
        current_qty = parseFloat(current_qty) - parseFloat(parseInt(qty));
    }

    $('#php_total span').html(parseFloat(current_t).toFixed(2));
    $('#qty span').html(current_qty);
    update_total_amount();
    
}

function update_total_amount(){
    var oTable = $('#table_id').dataTable();
    var lnth = oTable.fnSettings().aoData.length;
    $('#items_qty span').html(lnth);
    if(lnth == 0){ item_number=1; }
}


function search_duplicate(barcode){
    
    var oTable = $('#table_id').dataTable();
    oTable = $('#table_id').dataTable();
    var table_items =new Array();

    oTable.$('tr').each( function () {

        var data = oTable.fnGetData( this );
        table_items.push(data);

    });
    
    
    var result = new Array();
    var return_result = new Array();
    for( var i = 0, len = table_items.length; i < len; i++ ) {
        if( table_items[i][5] == barcode ) {
            result.push(table_items[i]);
            break;
        }
    }
    

    if(result.length > 0){
        return result[0];
    }
    else {
        return false;
    }

    
}



var calcDataTableHeight = function() {
    return $('#items').height()-25;
};

function autofittable(){
    $('.header_content').removeAttr('style');

    var oTable = $('#table_id').dataTable();
    var oSettings = oTable.fnSettings();
    oSettings.oScroll.sY= calcDataTableHeight(); 
    oTable.fnDraw();
    $('.dataTables_scrollHeadInner th').height($('.header_content span').height());
}

function resizefont(){

    $('.store_logo').textfill({ maxFontPixels: 52 });
    $('.total_box').textfill({ maxFontPixels: 55 });
    $('#sys_lock, .number_keys, .sub_total_value, #I_qty_text_holder').textfill({ maxFontPixels: 30 });
    $('#clr, #enter, #option, #log_out, #barcode-search, .sub_total_text').textfill({ maxFontPixels: 20 });
    $('#barcode_search, .desc_input, .desc_close').textfill({ maxFontPixels: 15 });
    $('.header_content').textfill({ maxFontPixels: 12 });
    $('#keyup, #keydown, #I_confirm, #C_confirm').textfill({ maxFontPixels: 30 });
    $('#keyup, #keydown, #I_confirm, #I_confirm').textfill({ maxFontPixels: 30 });
    $('#C_confirm').textfill({ maxFontPixels: 35 });
    $('.label_2').textfill({ maxFontPixels: 40 });
    $('#I_Qty_t, #I_Enter_t').textfill({ maxFontPixels: 30 });
    $('#C_wrong_item, #I_wrong_item').textfill({ maxFontPixels: 8 });
    $('#C_header, #I_header, .desc_label').textfill({ maxFontPixels: 15 });
    

    $('.autofit').autofit();
}

function fixheader(){
    $('.dataTable thead tr').eq(0).css('position','fixed');
    $('.dataTable thead tr').eq(0).height();
    $('.dataTable thead tr').eq(0).css({'margin-top':'-28'});
    $('.dataTable thead tr').eq(0).css({'width':$('.dataTable tbody').width()+16});
    $('.dataTable thead tr').eq(0).height($('#item_header').height());

}


function date_time(id){
        date = new Date;
        year = date.getFullYear();
        month = date.getMonth();
        months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'Jully', 'August', 'September', 'October', 'November', 'December');
        d = date.getDate();
        day = date.getDay();
        days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
        h = date.getHours();
        if(h<10) { h = "0"+h; }
        m = date.getMinutes();
        if(m<10) { m = "0"+m; }
        s = date.getSeconds();
        if(s<10) { s = "0"+s; }
        result = ''+days[day]+' '+months[month]+' '+d+' '+year+' '+h+':'+m+':'+s+'&nbsp;&nbsp;';
        document.getElementById(id).innerHTML = result;
        setTimeout('date_time("'+id+'");','1000');
        return true;
}


(function($) {
    $.fn.textfill = function(options) {
        var fontSize = options.maxFontPixels;
        var ourText = $('span', this);
        var maxHeight = $(this).height();
        var maxWidth = $(this).width();
        var textHeight;
        var textWidth;
        do {
            ourText.css('font-size', fontSize);
            textHeight = ourText.height();
            textWidth = ourText.width();
            fontSize = fontSize - 1;
        } while ((textHeight > maxHeight || textWidth > maxWidth) && fontSize > 3);
        return this;
    }
})(jQuery);



$( window ).resize(function() {
   resizefont();
   autofittable();
});


(function($){
    $.fn.autofit = function(){
        $(this).each(function(){
            $(this).css({'line-height':$(this).height()+'px'});
        });
    }
})(jQuery);



    


