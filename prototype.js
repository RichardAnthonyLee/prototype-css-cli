

module.exports = {

	exec: function( command, options ){


		if( typeof this.commands[ command ] === 'undefined' )
		{
			throw new Error("Attempted to execute undefined command");
		}

		//initialize config if not already

		if( command != 'init' && !this.config.config.length )
		{
			this.config.init();
		}		


		return this[ command ].apply( this, options );

	},

	setGen: function( gen ){

		this.gen = gen;
		return this;

	},

	setCli: function( cli ){

		this.cli = cli;
		return this;

	},

	setConfig: function( config ){

		this.config = config;
		return this;

	},

	init: function(){

		var generated = this.gen.initApp();

		if( generated )
		{

			console.log("prototype.css configuration generated");

		}
		else
		{

			console.log("could not generate prototype.css configuration");

		}

		

	},

	update: function(){

		var gen = this.gen;

        //build config

        gen.buildConfig()
           .prototypeConfig();

        //build prototype file
        
        gen.prototypes();   

		//build libraries

		gen.libraries()
		   .prototypeLibraries();

		//build static blocks   
		gen.buildStatic();

		//build blocks

		gen.blocks()
		   .criticalBlocks()
		   .prototypeBlocks();


		//build elements

		gen.elements()
		   .criticalElements()
		   .prototypeElements(); 

        
        //build modifiers

        gen.modifiers()
           .criticalModifiers()
           .prototypeModifiers();

        //build utlities
        
        gen.utilities()
           .criticalUtilities()
           .prototypeUtilities();

        //build fonts
        gen.fonts();   


	},

	create: function( type ){

		var module  = this.parseModule( type );

		var success = this.gen.generateModule( module );

		//if it's successful ask the user if they'd like to update 
		if( success )
		{

			console.log( module.type + " '" + module.name + "' created" );

			var prototype = this;

			this.cli.prompt([
				{
					type:    'confirm',
					name:    'config',
					message: 'update config file?'
				},
				{
					type:    'confirm',
					name:    'build',
					message: 'update build?'
				}
					
			], function( update ){

				//if config update, add new module to config file
				if( update.config )
				{

					prototype.gen.saveModule( module );

					console.log( module.type + " '" + module.name + "' saved to " + prototype.gen.config.configFile );

				}

				//if update build, run the update command
				if( update.build )
				{

					prototype.update();

				}
					

			});

		}


	},

	parseModule: function( type ){

		var type   = type.toLowerCase().split(":"),
		    module = {
		    	type : type[0],
		    	name : type[1]
		    };

		if( type.length != 2 )
		{
			throw new Error( "Invalid format given for module must be 'type:name' " );
		}  

		if( module.type != 'prototype' && module.type != 'component' )
		{	
			throw new Error( "Invalid argument for create, type must be either prototype or component" );
		}

		return module;

	},
	commands: {

		update : 'update',
		create : 'create',
		init   : 'init'

	}	

};
