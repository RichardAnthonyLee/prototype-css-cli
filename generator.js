

module.exports = {	

	initApp: function(){

		try{

			//if the config file is found return false
			this.config.fs.readFileSync( this.config.configFile );

			console.log( this.config.configFile + " already exists in current directory" );

			return false;

		} catch( error ){	


			var configPath = this.config.getGlobalConfigPath();

			this.config.configFile = configPath;

			//run from the root dir
			this.config.init( this.config.getRootDir() );

			//get the path to the app template
			var appTemplatePath = __dirname + "/templates/app"; 

			//copy it's conents into current directory
			this.config.fs.copySync( appTemplatePath, "." );	

		}

		return true;	

	},

	setConfig: function( config ){

		this.config = config;
		return this;

	},

	data: function(){

		return this.config.config;

	},

	saveModule: function( module ){


		var config = this.config.config;

		//pluralize the module type ( components or prototypes )
		var type = module.type + "s";


		//only add the module if it's not already in config
		for( var i = 0; config[ type ].length > i; i++ )
		{

			if( module.name === config[ type ][i].name )
			{
				return false;
			}

		}


		//add module to config object
		config[ type ].push( { name : module.name  } );


		this.config.config = config;


		//this will perform update on config, adding new module
		//and remove non-exisiting
		this.updateConfig();

	},

	updateConfig: function(){

		//convert back to json
		var contents = JSON.stringify( this.config.config, null, 4 );

		//save
		this.config.fs.writeFileSync( this.config.configFile , contents );


		//reload the config
		this.config.init();

	},

	generateModule: function( module, confirm ){


		//make sure module type is prototype or component

		if( ['prototype', 'component'].indexOf( module.type ) === -1 )
		{
			throw new Error( "module type must be either prototype or component, '" + module.type + "' was given" );
		}

		//get all types

		var modules = this.config[ module.type + 's' ];


		for( var i = 0; modules.length > i; i++ )
		{

			//if the module already exists, throw error

			if( modules[i].data.name === module.name )
			{

				throw new Error( module.type + " with name '" + module.name + "' already exists, cannot overwrite " );

			}

		}

		//get filesystem
		var fs = this.config.fs;

		//build the path
		var dir = this.config.getPath( module.name, module.type + "_dir" ),
		    tpl = this.config.getPath( module.type, "template_dir" );


		//create the directory

		fs.mkdirpSync( dir );

		//now recursitivly copy all files and diretories of the template dir
		fs.copySync( tpl, dir );


		return true;


	},

	buildConfig: function(){

		return this.build({
			modules     :  this.config.components,
			module_path :  'config_path',
			tpl         :  '_config',
			dir         :  this.data().component_dir,
			path        :  this.data().config_path,
			filename    :  '_config.scss'  
		});

	},

	prototypeConfig: function(){

		return this.build({
			modules     :  this.config.prototypes,
			module_path :  'config_path',
			tpl         :  '_prototype-config',
			dir         :  this.data().prototype_dir,
			path        :  this.data().config_path,
			filename    :  '_prototype-config.scss'  
		});

	},

	prototypes: function(){

		return this.build({
			modules     :  this.config.prototypes,
			module_path :  'prototype_path',
			tpl         :  '_prototype',
			dir         :  this.data().prototype_dir,
			path        :  this.data().prototype_path,
			filename    :  '_prototype.scss'  
		});

	},

	libraries: function(){

		return this.build({
			modules     :  this.config.components,
			module_path :  'library_path',
			tpl         :  '_library',
			dir         :  this.data().component_dir,
			path        :  this.data().library_path,
			filename    :  '_library.scss'  
		});

	},

	prototypeLibraries: function(){


		return this.build({
			modules     :  this.config.prototypes,
			module_path :  'library_path',
			tpl         :  '_prototype-library',
			dir         :  this.data().prototype_dir,
			path        :  this.data().library_path,
			filename    :  '_prototype-library.scss'  
		});

	},

	blocks: function(){

		return this.build({
			modules     :  this.config.components,
			module_path :  'block_path',
			tpl         :  '_blocks',
			dir         :  this.data().component_dir,
			path        :  this.data().block_path,
			filename    :  '_blocks.scss'  
		});

	},

	criticalBlocks: function(){

		return this.build({
			modules     :  this.config.components,
			module_path :  'critical_block_path',
			tpl         :  '_critical-blocks',
			dir         :  this.data().component_dir,
			path        :  this.data().critical_block_path,
			filename    :  '_critical-blocks.scss'  
		});

	},

	prototypeBlocks: function(){


		return this.build({
			modules     :  this.config.prototypes,
			module_path :  'block_path',
			tpl         :  '_prototype-blocks',
			dir         :  this.data().prototype_dir,
			path        :  this.data().block_path,
			filename    :  '_prototype-blocks.scss'  
		});

	},

	elements: function(){

		return this.build({
			modules     :  this.config.components,
			module_path :  'element_path',
			tpl         :  '_elements',
			dir         :  this.data().component_dir,
			path        :  this.data().element_path,
			filename    :  '_elements.scss'  
		});

	},

	criticalElements: function(){

		return this.build({
			modules     :  this.config.components,
			module_path :  'critical_element_path',
			tpl         :  '_critical-elements',
			dir         :  this.data().component_dir,
			path        :  this.data().critical_element_path,
			filename    :  '_critical-elements.scss'  
		});

	},	

	prototypeElements: function(){

		return this.build({
			modules     :  this.config.prototypes,
			module_path :  'element_path',
			tpl         :  '_prototype-elements',
			dir         :  this.data().prototype_dir,
			path        :  this.data().element_path,
			filename    :  '_prototype-elements.scss'  
		});

	},	

	modifiers: function(){

		return this.build({
			modules     :  this.config.components,
			module_path :  'modifier_path',
			tpl         :  '_modifiers',
			dir         :  this.data().component_dir,
			path        :  this.data().modifier_path,
			filename    :  '_modifiers.scss'  
		});

	},	

	criticalModifiers: function(){

		return this.build({
			modules     :  this.config.components,
			module_path :  'critical_modifier_path',
			tpl         :  '_critical-modifiers',
			dir         :  this.data().component_dir,
			path        :  this.data().modifier_path,
			filename    :  '_critical-modifiers.scss'  
		});

	},		

	prototypeModifiers: function(){

		return this.build({
			modules     :  this.config.prototypes,
			module_path :  'modifier_path',
			tpl         :  '_prototype-modifiers',
			dir         :  this.data().prototype_dir,
			path        :  this.data().modifier_path,
			filename    :  '_prototype-modifiers.scss'  
		});

	},

	buildStatic: function(){

		return this.build({
			modules     :  this.config.prototypes,
			module_path :  'static_path',
			tpl         :  '_static',
			dir         :  this.data().prototype_dir,
			path        :  this.data().static_path,
			filename    :  '_static.scss'  
		});

	},	

	utilities: function(){

		return this.build({
			modules     :  this.config.components,
			module_path :  'utility_path',
			tpl         :  '_utility',
			dir         :  this.data().component_dir,
			path        :  this.data().utility_path,
			filename    :  '_utility.scss'  
		});

	},

	criticalUtilities: function(){

		return this.build({
			modules     :  this.config.components,
			module_path :  'critical_utility_path',
			tpl         :  '_critical-utility',
			dir         :  this.data().component_dir,
			path        :  this.data().critical_utility_path,
			filename    :  '_critical-utility.scss'  
		});

	},	

	prototypeUtilities: function(){

		return this.build({
			modules     :  this.config.prototypes,
			module_path :  'utility_path',
			tpl         :  '_prototype-utility',
			dir         :  this.data().prototype_dir,
			path        :  this.data().utility_path,
			filename    :  '_prototype-utility.scss'  
		});

	},

	fonts: function(){

		return this.build({
			modules     :  this.config.components,
			module_path :  'font_path',
			tpl         :  '_fonts',
			dir         :  this.data().component_dir,
			path        :  this.data().font_path,
			filename    :  '_fonts.scss'  
		});

	},	

	build: function( options ){


		var modules = this.config.getModulesWith( options.modules, options.module_path );
		

		var content = this.makeFile( options.tpl, {
			imports  : modules,
			path     : {
				dir  : options.dir,
				file : options.path
			}
		});


        this.save( options.filename , content );

        return this;


	},

	makeFile: function( template, param ){

		var template = this.config.getTemplatePath( template + ".scss.tpl" );
        
        var template = this.config.fs.readFileSync( template ).toString();

        var template = this.config.tpl.compile( template );

		return template( param );

	},

	save: function( path, contents ){

		var path = this.config.getPath( path );

		this.config.fs.writeFileSync( path, contents );

		console.log( path + " updated " );

	},
};
