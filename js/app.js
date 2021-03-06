function callAPI(func, url, source, datatype) {
    $.ajax({
        url: url,
        type: "POST",
        processData: false,
        data: source,
        contentType: datatype,
        error: function(xhr, textStatus, errorThrown) {
            displayMessages(JSON.parse(xhr.responseText));
        },
        success: function(xhr) {
            processFunc(func, xhr);
        }
    });
}

function processFile(func) {
    var uploadField = document.getElementById("filename");
    var file = uploadField.files[0];
    
    try {
        var reader = new FileReader();
        
        reader.onerror = function(err) {
            console.log(err);
        };
        
        reader.onload = function(event) {
            var source = event.target.result; // this is the binary values
            var params = $("#myform").serialize();
            params = params + "&process=" + func + "&filename=" + file.name;
            var url = "./xsjs/fileupload.xsjs?" + params;
            
            callAPI(func, url, source, file.type)
        };
        reader.readAsText(file);
    } catch (err) {
        var messages = [];
        messages.push(err);
        var objData = {};
        objData.messages = messages;
        displayMessages(objData);
    }
    
}

function processFunc(func, data) {
    objData = JSON.parse(data);
    if (func === "preview") {
        displayTableData(objData);
    } else if (func === "init") {
        tableData = objData;
        displayInit(objData);
    }
    displayMessages(objData);
}

function displayInit(objData) {
    var schemas = $('#schemaname');
    schemas.empty();
    $.each(objData.schemas, function(index, objRow) {
        schemas.append(
            $('<option></option>').val(objRow.SCHEMA_NAME).html(objRow.SCHEMA_NAME)
        );
    });
}

function diaplyTables(schemaname) {
    var tables = $('#tablename');
    tables.empty();
    $.each(tableData.tables, function(index, objRow) {
        if (objRow.SCHEMA_NAME === schemaname){
            tables.append(
                $('<option></option>').val(objRow.TABLE_NAME).html(objRow.TABLE_NAME)
            );
        }
    });
}

function displayMessages(objData) {
    $("#messages").html("");
    if (objData.messages.length > 0){
        var html = "<div class=\"ui divider\"></div><div class=\"ui info message\">";
        html += "<i class=\"close icon\"></i>";
        html += "<div class=\"header\">Information:</div>";
        html += "<ul class=\"list\">";
        $.each(objData.messages, function(index, objRow) {
            html += "<li>" + objRow + "</li>";
        });
        html += "</ul></div><div class=\"ui divider\">";
    $("#messages").html(html);
    }
}

function displayTableData(objData) {
    var html = "<table class=\"ui celled table\">";
    html += "<thead>";
    html += "<tr>";
    html += "<th>CSV Value</th>";
    html += "<th>Column Name</th>";
    html += "<th>Column Type</th>";
    html += "<th>Column Data Type</th>";
    html += "<th>Column Precision</th>";
    html += "<th>Column Data</th>";
    html += "</tr>";
    html += "</thead>";
    html += "<tbody>";

    $.each(objData.tabledata, function(index, objRow) {
        html += "<tr>";
        html += "<td>" + objRow.value + "</td>";
        html += "<td>" + objRow.columnname + "</td>";
        html += "<td>" + objRow.columntype + "</td>";
        html += "<td>" + objRow.columndatatype + "</td>";
        html += "<td>" + objRow.columnprecision + "</td>";
        html += "<td>" + objRow.columndata + "</td>";
        html += "</tr>";
    });
    html += "</tbody>";
    html += "</table>";
    $("#tabledata").html(html);
}


$(document).ready(function() {
    var tableData = {};
    callAPI("init", "./xsjs/fileupload.xsjs?process=init", "", "");
    
    $( "#schemaname" ).change(function() {
        diaplyTables($( "#schemaname" ).val());
    });
});