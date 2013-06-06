var pimpMyFilter;
var pimpFields;
(function( $ ){
    pimpMyFilter = {
            NAME: "PimpMyFilter",
            VERSION:'0.1',
            AUTHOR:{
                name:"Fynjah",
                mail:"fynjah@gmail.com",
            },
            //api
            setModalWidth: function(width){
                _this = this;
                _this.settings.modalWidth = width;
                $(this.__object).css({
                    width:_this.settings.modalWidth,
                    marginLeft:_this.settings.modalWidth/-2,
                });
            },
            useFilter:function(filter_id){
                if((filter_id !== '') && (filter_id !== 'undefined')) {
                    var response = false;
                    var jqxhr = $.ajax({
                        type: "GET",
                        data: 'filter_id='+parseInt(filter_id),
                        url: this.settings.url+"use_filter/",
                        dataType: "json",
                        global: false,
                        async:false,
                        success:function(data){
                            response = data;
                        }
                    });
                    return response;
                }
                else 
                    return false;
            },
            getFiltersByUser:function(){
                var response = false;
                var jqxhr = $.ajax({
                    type: "GET",
                    url: this.settings.url+"get_filters_by_user/",
                    dataType: "json",
                    global: false,
                    async:false,
                    success:function(data){
                      response = data;
                    }
                });
                return response;
            },
            //end api
            __object : null,
            __buttonRemove: function(){
                button = $('<button/>').addClass('btn row-remove btn-block').text('Remove').css({margin:'0 10px 0 0'});
                div = $('<div/>').addClass('span3');
                _this = this;
                button.on('click', function(e){
                    e.preventDefault();
                    $(this).parent().parent().remove();
                    if(($(_this.__object).find('.modal-body form .condition').size() < _this.settings.limit) && $(_this.__object).find('a.new-row').hasClass('disabled')){
                        $(_this.__object).find('a.new-row').removeClass('disabled');
                    }
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
                operators = '<option value="0">-----</option>';
                fields = '<option value="0">-----</option>';
                
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
                    if(val === '0'){
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
                if(this.settings.limit !== 1){                
                    dv.append(this.__buttonRemove());
                }
                condition.append(dv)

                return $(condition);
            },
            __menu: function(){
                menu = this.__row();
                dv_menu = $('<div/>').addClass('span12');
                filter_name = $('<input/>').attr('type', 'text').attr('placeholder','Filter name').addClass('filter_name input-block-level').attr('required', 'required');
                dv_filter_name = $('<div/>').addClass('span3').append(filter_name);
                new_cond_button = $('<a/>').addClass('btn new-row span3').attr('href','#').html('<i class="icon-plus"></i> Add condition').attr('title','New condition');
                
                quick = $('<label/>').addClass('checkbox inline span3');
                quick.append($('<input/>').attr('type','checkbox').addClass('quick-filter') )
                quick.append('Quick filter?')

                _this = this;
                new_cond_button.on('click', function(e){
                    e.preventDefault();

                    if($(this).hasClass('disabled')){
                        return false;
                    }
                    else{
                        filter = $(_this.__object).find('.modal-body form');
                        filter.append(_this.__condition());   
                        if( (_this.settings.limit !== 0) && (filter.find('.condition').size() >= _this.settings.limit) ){
                            $(this).addClass('disabled');
                        }
                    }
                });
                
                if(this.settings.limit !== 1){
                    dv_menu.append(new_cond_button);
                }
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
                    var error = false;
                    if(filter.find('input.filter_name').val() === ''){
                        error = true;
                        filter.find('input.filter_name').css({outline:'1px solid #ff0000'})
                    }
                    else{
                        filter.find('input.filter_name').css({outline:'none'})
                    }
                    response = {
                        name: filter.find('input.filter_name').val(),
                        quick: filter.find('input.quick-filter').prop("checked"),
                        app: _this.settings.app,
                        model: _this.settings.model,
                    }
                    conditions = {}
                    $.each(filter.find('.condition'), function(key, condition){
                        var field = $(condition).find('select.fields').val();
                        var operator = $(condition).find('select.operators').val();
                        var value_field = $(condition).find('input.value');
                        var value_data = value_field.data('pimpMyFilter');
                        var value = value_field.val();
                        if( (field === '0') || (operator === '0') || (value === 'undefined') || (value === ''))
                        {
                            $(this).find('.span12').css({outline:'1px solid #ff0000'})
                            error = true;
                        }
                        else{
                            $(this).find('.span12').css({outline:'none'})
                        }
                        conditions[key] = {
                            field:encodeURIComponent( field ),
                            operator:encodeURIComponent( operator ),
                            value:encodeURIComponent( value ),
                            value_data:value_data
                        }
                    });
                    response.conditions = conditions;
                    if(!error){
                        var jqxhr = $.ajax({
                            type: "POST",
                            data: 'filter='+window.JSON.stringify(response),
                            url: _this.settings.url+"save_filter/",
                            dataType: "json",
                            global: false,
                            async:false,
                            success: function(data){
                                _this.__hideBody()
                            }
                        });
                    }
            },
            __hideBody:function(){
                _this = this;
                m_body = $(_this.__object).find('.modal-body');
                m_body.animate({
                    opacity:0
                }, 1000);
                m_body.queue(function() {
                    $(_this.__object).modal('hide');
                    m_body.css({'opacity':1})
                    $(this).dequeue();
                });
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
                            url: settings.url+"get_structure/",
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
                                            "__gt",
                                            "MORE"
                                        ],
                                        [
                                            "__gte",
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
                    $(this.__object).find('.modal-footer').append(this.__save_button()).css({position:'relative', zIndex:1}); //bootstrap typeahead fix
                
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
            __typeahead_storage:{

            },
            settings:{
                structure : null,
                header : 'New filter',
                app: null,
                model: null,
                name : '',
                modalWidth:800,
                url:'/pimp-my-filter/' ,
                limit:0,
            },
        }
        pimpFields = {
                __parent:pimpMyFilter,
                __AbstractInputField:function(requestedField){
                    var field = $('<input/>').addClass('value input-block-level');
                    var data = requestedField;
                    field.data('pimpMyFilter', data);
                    return field;
                },
                __AbstractSelectField:function(requestedField){
                    var field = $('<select/>').addClass('value input-block-level');
                    var data = requestedField;
                    field.data('pimpMyFilter', data);
                    return field;
                },
                ForeignKey:function(requestedField){
                    var field = this.__AbstractInputField(requestedField);
                    field.attr('autocomplete','off').attr('type','text').attr('placeholder','Start typing...');
                    var typeahead = [];
                    var _this = this;
                    var jqxhr = $.ajax({
                        type: "POST",
                        data: 'field='+requestedField.name+'&app='+this.__parent.settings.app+'&model='+this.__parent.settings.model,
                        url: this.__parent.settings.url+"get_typeahead/",
                        dataType: "json",
                        global: false,
                        async:true,
                        success: function(data){
                            _this.__parent.__typeahead_storage[requestedField.type+'__'+requestedField.name] = data;
                            $.each(data, function(k,v){typeahead.push(v.unicode)});
                            field.typeahead({
                                source:typeahead, 
                                updater:function(item){
                                    obj = _this.__parent.__typeahead_storage[requestedField.type+'__'+requestedField.name]
                                    $.each(obj, function(k,v){
                                        if(v.unicode === item){
                                            data = $(field).data('pimpMyFilter');
                                            data.fk_id = v.id;
                                            $(field).data('pimpMyFilter', data);
                                        }
                                    });
                                    return item;
                                }
                            });
                        }

                    });
                    return field;
                },
                CharField:function(requestedField){
                    return this.__AbstractInputField(requestedField).attr('type','text');
                },
                BooleanField:function(requestedField){
                    var field = this.__AbstractInputField(requestedField).attr('type','checkbox');
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
                IntegerField:function(requestedField){
                    return this.__AbstractInputField(requestedField).attr('type','number');
                },
                BigIntegerField:function(requestedField){
                    return this.__AbstractInputField(requestedField).attr('type','number');
                },
                CommaSeparatedIntegerField:function(requestedField) {
                    return this.__AbstractInputField(requestedField).attr('type','text');
                },
                DateField:function(requestedField){
                    return this.__AbstractInputField(requestedField).attr('type','date');
                },
                DateTimeField:function(requestedField){
                    return this.__AbstractInputField(requestedField).attr('type','datetime-local');
                },
                DecimalField:function(requestedField){
                    var field = this.__AbstractInputField(requestedField).attr('type','number'); 
                    field.attr('placeholder','1.0');
                    field.attr('pattern', '(^[+]?\d*\.?\d*[1-9]+\d*$)|(^[+]?[1-9]+\d*\.\d*$)');
                    return field;
                },
                EmailField:function(requestedField){
                    return this.__AbstractInputField(requestedField).attr('type','email');
                },
                FileField:function(requestedField){
                    return this.BooleanField(requestedField);
                },
                FieldFile:function(requestedField){
                    return this.BooleanField(requestedField);
                },
                FilePathField:function(requestedField){
                    return this.__AbstractInputField(requestedField).attr('type','text');
                },
                FloatField:function(requestedField){
                    return this.DecimalField(requestedField);
                },
                ImageField:function(requestedField){
                    return this.BooleanField(requestedField);
                },
                IntegerField:function(requestedField){
                    var field = this.__AbstractInputField(requestedField).attr('type','number');
                    field.attr('pattern','^[0-9]+$')
                    return field;
                },
                IPAddressField:function(requestedField){
                    var field = this.__AbstractInputField(requestedField).attr('type','text');
                    field.attr('placeholder','255.255.255.255')
                    field.attr('pattern','((^|\.)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]?\d))){4}$')
                    return field;
                },
                GenericIPAddressField:function(requestedField){
                    return this.IPAddressField(requestedField);
                },
                NullBooleanField:function(requestedField){
                    return this.BooleanField(requestedField);
                },
                PositiveIntegerField:function(requestedField){
                    return this.__AbstractInputField(requestedField).attr('type','number');
                },
                PositiveSmallIntegerField:function(requestedField){
                    return this.__AbstractInputField(requestedField).attr('type','number');
                },
                SlugField:function(requestedField){
                    return this.__AbstractInputField(requestedField).attr('type','text').attr('pattern', '^[a-zA-Z0-9\-_]+$');
                },
                SmallIntegerField:function(requestedField){
                    return this.__AbstractInputField(requestedField).attr('type','number'); 
                },
                TextField:function(requestedField){
                    return this.__AbstractInputField(requestedField).attr('type','text');
                },
                TimeField:function(requestedField){
                    return this.__AbstractInputField(requestedField).attr('type','time');
                },
                URLField:function(requestedField){
                    return this.__AbstractInputField(requestedField).attr('type','url');
                },
                ManyToManyField:function(requestedField){
                    return this.ForeignKey(requestedField)
                },
                OneToOneField:function(requestedField){
                    return this.ForeignKey(requestedField)
                },
            }           

  var methods = {
    init : function( options ) { 
        var settings = $.extend(pimpMyFilter.settings, options);
        pimpMyFilter.settings = $.extend(settings, options);
        pimpMyFilter.__object = this;
        $(this).off('.data-api').modal('show');
        $(this).find('.modal-body').css({overflow:"visible"}) //bootstrap typeahead fix
        return pimpMyFilter.__createFilter()
    },
    newCondition: function(){
        filter = this.find('.modal-body form')
        filter.append(pimpMyFilter.__condition());
        return this;
    },
  };

  $.fn.pimpMyFilter = function( method ) {
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist.' );
    } 
  };

})( jQuery );