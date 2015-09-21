module.exports = {	

	configFile:  './prototype.css.json', 
	config: {},
    init: function( dir ){

        this.load();

        var dir = this.config.dir = ( dir ? (dir + '/') : '' ) + this.config.dir + "/";

        this.setComponents( this.config.components, dir + this.config.component_dir );
        this.setPrototypes( this.config.prototypes, dir + this.config.prototype_dir );

    },
	setFileSystem: function( fs ){

		this.fs = fs;
		return this;

	},
    load: function () {
        
        try{

           //attempt to load local config
    	   var config  = this.fs.readFileSync( this.configFile );

        } catch( error ){

           //if no local config throw, tell user to build local config
           throw new Error( "config file " + this.configFile + " not found, run init command to create it" );

        }

    	this.config = JSON.parse( config );
        return this;

    },
    getGlobalConfigPath: function(){

        return this.getRootDir() + "/" + this.configFile;

    },
    getRootDir: function(){

        return __dirname;

    },
    setTemplateProvider: function( tpl ){

        this.tpl = tpl;
        return this;

    },
    setModuleFactory: function( module ){

        this.module = module;
        return this;

    },
    setComponents: function( components, dir ){

        this.components        = this.makeModules( components, dir );
        this.updateModules( 'components', this.components );


    },
    setPrototypes: function( prototypes, dir ){

        this.prototypes = this.makeModules( prototypes, dir );
        this.updateModules( 'prototypes', this.prototypes );
  

    },
    updateModules: function( type, modules ){

        this.config[ type ] = [];

        for( var i = 0; this[ type ].length > i; i++ )
        {

            this.config[ type ].push( { name : this[ type ][i].data.name } ); 

        }   

    },
    makeModules: function( modules, dir ){

        var collection = [], 
            savedMod   = [];

        for( var i = 0; modules.length > i; i++ ){

            var mod = this.module.make( this.fs, modules[i], dir + "/" + modules[i].name, this.config );

            //only add to collection if module exists

            if( mod.exists() && savedMod.indexOf( mod.data.name ) === -1 )
            {

                savedMod.push( mod.data.name );
                collection.push( mod );

            }
            

        }

        return collection;

    },
    getModulesWith: function( modules, path, dir ){

        var collection = [];

        for( var i = 0; i < modules.length; i++ )
        {

            if( modules[i].has( path, dir ) )
            {

                collection.push( modules[i] );

            }

        }

        return collection;

    },
    getPath: function( path, dir ){

        var base = this.config.dir;

        if( dir ) base += "/" + this.config[ dir ];

        if( this.config[path] ) path = this.config[path];

        return base + "/" + path;

    },
    getTemplatePath: function( file ){


        return this.getPath( file, 'template_dir' );

    }
};