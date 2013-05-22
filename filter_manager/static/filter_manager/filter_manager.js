var pimpMyFilter;
var pimpFields;
(function( $ ){
    pimpMyFilter = {
            NAME: "PimpMyFilter",
            VERSION:'0.1b',
            AUTHOR:{
                name:"Fynjah",
                mail:"fynjah@gmail.com",
            },
            setModalWidth: function(width){
                _this = this;
                $(this.__object).css({
                    width:_this.settings.modalWidth,
                    marginLeft:_this.settings.modalWidth/-2,
                });
            },
            __object : null,
            __buttonRemove: function(){
                button = $('<button/>').addClass('btn row-remove btn-block').text('Remove').css({margin:'0 10px 0 0'});
                div = $('<div/>').addClass('span3');
                button.on('click', function(e){
                    e.preventDefault();
                    $(this).parent().parent().remove();
                });
                div.append(button)
                return $(div);
            },
            __row: function(){
                row = $('<div/>').addClass('row-fluid');
                return $(row);
            },
            __select: function(class_name, options){
                select = $('<select/>').addClass(class_name).attr('name', class_name).html(options).addClass('input-block-level')
                div = $('<div/>').addClass('span3');
                div.append(select)
                return $(div);
            },
            __condition: function () {
                condition = this.__row();
                condition.addClass('condition');
                dv = $('<div/>').addClass('span12 well well-small').css({marginBottom:'10px'});
                dv_value = $('<div/>').addClass('span3 value-wrap pull-left');
                operators = '<option>-----</option>';
                fields = '<option>-----</option>';
                
                $.each(this.settings.structure.operators, function (index, elem) {
                    operators += '<option value="'+elem[0]+'">'+elem[1]+'</option>'
                });
                $.each(this.settings.structure.fields, function (index, elem) {
                    fields += '<option value="'+elem.name+'">'+elem.name+'</option>'
                });


                select_field = this.__select('fields', fields);
                _this = this;
                select_field.find('select').on('change', function(e){
                    e.preventDefault();
                    _select = $(this);
                    val = $(this).val();
                    if(val == '-----'){
                        _select.parent().parent().find('.value-wrap').html('')
                    }
                    else{
                        $.each(_this.settings.structure.fields, function(k,v){
                            if(v.name === val){
                                _select.parent().parent().find('.value-wrap').html(pimpFields[v.type](v));
                            }
                        });
                    }

                })

                dv.append(select_field);
                dv.append(this.__select('operators', operators));
                dv.append(dv_value);
                dv.append(this.__buttonRemove());
                condition.append(dv)

                return $(condition);
            },
            __menu: function(){
                menu = this.__row();
                dv_menu = $('<div/>').addClass('span12');
                filter_name = $('<input/>').attr('type', 'text').attr('placeholder','Filter name').addClass('filter_name');
                dv_filter_name = $('<div/>').addClass('span3').append(filter_name);
                new_cond_button = $('<a/>').addClass('btn new-row span3').attr('href','#').html('<i class="icon-plus"></i> Add condition').attr('title','New condition');
                
                quick = $('<label/>').addClass('checkbox inline span3');
                quick.append($('<input/>').attr('type','checkbox').addClass('quick-filter') )
                quick.append('Quick filter?')

                _this = this;
                new_cond_button.on('click', function(e){
                    e.preventDefault();
                    filter = $(_this.__object).find('.modal-body form');
                    filter.append(_this.__condition());
                });
                
                dv_menu.append(new_cond_button);
                dv_menu.append(dv_filter_name);
                dv_menu.append(quick);
                menu.append(dv_menu);
                
                return $(menu);
            },
            __save_button: function (){
                btn = $('<a/>').addClass('btn btn-primary save-filter').html('Save filter').attr('href','#').attr('title', 'Save filter');
                _this = this;
                btn.on('click', function(e){
                    e.preventDefault();
                    _this.__save_filter($(_this.__object).find('form.filter'));

                });
                return $(btn);
            },
            __save_filter: function(filter){
                    _this = this
                    responce = {
                        name: filter.find('input.filter_name').val(),
                        quick: filter.find('input.quick-filter').prop("checked"),
                        app: _this.settings.app,
                        model: _this.settings.model,
                    }
                    conditions = {}
                    $.each(filter.find('.condition'), function(key, condition){
                        field = $(condition).find('select.fields').val();
                        operator = $(condition).find('select.operators').val();
                        value = $(condition).find('input.value').val();
                        conditions[key] = {
                            field:field,
                            operator:operator,
                            value:value
                        }
                    });
                    responce.conditions = conditions;
                        var jqxhr = $.ajax({
                            type: "POST",
                            data: 'filter='+window.JSON.stringify(responce),
                            url: _this+"save_filter/",
                            dataType: "json",
                            global: false,
                            async:false,
                            success: function(data){
                                _this.__hideBody()
                            }
                        });
            },
            __hideBody:function(){
                m_body = this.find('.modal-body');
                mbody.animate({
                    opacity:'0'
                }, 1000);
                return m_body;
            },
            __createFilter: function(){
                this.setModalWidth(this.settings.modalWidth)
                body = $(this.__object).find('.modal-body');
                body.html('');
                settings = this.settings;
                if( ( ! settings.structure ) && (settings.app && settings.model) ) {
                    if( settings.app && settings.model ){
                        var jqxhr = $.ajax({
                            type: "POST",
                            data:'app='+settings.app+'&model='+settings.model,
                            url: settings.url+'get_structure/",
                            dataType: "json",
                            global: false,
                            async:false,
                            success: function(data){
                                settings.structure = data;
                                /*
                                    structure should be as:
                                {
                                    "fields": {
                                        "1": {
                                            "type": "CharField",
                                            "name": "name"
                                        },
                                        "2": {
                                            "type": "DateField",
                                            "name": "date_added"
                                        },
                                        ...
                                },
                                "operators": [
                                        [
                                            "more",
                                            "MORE"
                                        ],
                                        [
                                            "more_eq",
                                            "MORE or EQUAL"
                                        ],
                                        ...
                                ]
                                */
                            }
                        });
                    }
                    else {
                        $.error('Options "app" and "model" must be assigned, if option "structure" not assigned.')
                        return false;
                    }
                }

                header = $(this.__object).find('.modal-header h3');
                header.text(settings.header + ' for ' + settings.name)
                if(! $('.modal-footer .save-filter').size() > 0)
                    $(this.__object).find('.modal-footer').append(this.__save_button());
                
                code = $('<div/>').append('<form/>');
                
                thead = this.__row();
                thead.append('<div class="span3" style="text-align:center;">Field</div>');
                thead.append('<div class="span3" style="text-align:center;">Logical operator</div>');
                thead.append('<div class="span3" style="text-align:center;">Value</div>');

                filter = code.find('form');
                filter.addClass('form-inline filter');
                filter.append(this.__menu());
                filter.append(thead);
                filter.append(this.__condition());

                body.html(code);
                
                return $(this.__object)
            },

            settings:{
                structure : null,
                header : 'New filter',
                app: null,
                model: null,
                name : '',
                modalWidth:800,
                url:'/pimp-my-filter/' ,
            },
        }
        pimpFields = {
                __parent:pimpMyFilter,
                __AbstractInputField:function(){
                    field = $('<input/>').addClass('value input-block-level');
                    return field;
                },
                __AbstractSelectField:function(){
                    field = $('<select/>').addClass('value input-block-level');
                    return field;
                },
                ForeignKey:function(requestedField){
                    field = this.__AbstractInputField();
                    field.attr('type','text').attr('placeholder','Start typing...');
                    var jqxhr = $.ajax({
                        type: "POST",
                        data: 'field='+requestedField.name+'&app='+this.__parent.settings.app+'&model='+this.__parent.settings.model,
                        url: __parent.settings.url+"get_typeahead/",
                        dataType: "json",
                        global: false,
                        async:false,
                        success: function(data){
                            typeahead = []
                            $.each(data, function(k,v) {
                                typeahead.push(v)
                            })
                            field.typeahead({
                                source:typeahead
                            });
                        }
                    });

                    return field;
                },
                CharField:function(){
                    return this.__AbstractInputField().attr('type','text');
                },
                BooleanField:function(){
                    field = this.__AbstractInputField().attr('type','checkbox');
                    field = $('<label/>').append(field).append('<small> False</small>');
                    field.on('click', function(){
                        if($(this).find('input').is(':checked')){
                            $(this).find('small').text(' True')
                        }
                        else{
                            $(this).find('small').text(' False')
                        }
                    })
                    return field;
                },
                IntegerField:function(){
                    return this.__AbstractInputField().attr('type','text');
                },
                BigIntegerField:function(){
                    return this.__AbstractInputField().attr('type','text');
                },
                CommaSeparatedIntegerField:function() {
                    return this.__AbstractInputField().attr('type','text');
                },
                DateField:function(){
                    return this.__AbstractInputField().attr('type','date');
                },
                DateTimeField:function(){
                    return this.__AbstractInputField().attr('type','datetime-local');
                },
                DecimalField:function(){
                    return this.__AbstractInputField().attr('type','number');
                },
                EmailField:function(){
                    return this.__AbstractInputField().attr('type','email');
                },
                FileField:function(){
                    return this.BooleanField();
                },
                FieldFile:function(){
                    return this.BooleanField();
                },
                FilePathField:function(){
                    return this.__AbstractInputField().attr('type','text');
                },
                FloatField:function(){
                    return this.__AbstractInputField().attr('type','number');
                },
                ImageField:function(){
                    return this.BooleanField();
                },
                IntegerField:function(){
                    return this.__AbstractInputField().attr('type','number');
                },
                IPAddressField:function(){
                    return this.__AbstractInputField().attr('type','text');
                },
                GenericIPAddressField:function(){
                    return this.__AbstractInputField().attr('type','text');
                },
                NullBooleanField:function(){
                    return this.BooleanField();
                },
                PositiveIntegerField:function(){
                    return this.__AbstractInputField().attr('type','number');
                },
                PositiveSmallIntegerField:function(){
                    return this.__AbstractInputField().attr('type','number');
                },
                SlugField:function(){
                    return this.__AbstractInputField().attr('type','text');
                },
                SmallIntegerField:function(){
                    return this.__AbstractInputField().attr('type','number'); 
                },
                TextField:function(){
                    return this.__AbstractInputField().attr('type','text');
                },
                TimeField:function(){
                    return this.__AbstractInputField().attr('type','time');
                },
                URLField:function(){
                    return this.__AbstractInputField().attr('type','url');
                }
            }           

  var methods = {
    init : function( options ) { 
        var settings = $.extend(pimpMyFilter.settings, options);
        pimpMyFilter.settings = $.extend(settings, options);
        pimpMyFilter.__object = this;
        $(this).off('.data-api').modal('show');
        return pimpMyFilter.__createFilter()
    },
    newCondition: function(){
        filter = this.find('.modal-body form')
        filter.append(pimpMyFilter.__condition());
        return this;
    },
  };

  $.fn.pimpMyFilter = function( method ) {
    
    // логика вызова метода
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist.' );
    } 
  };

})( jQuery );




