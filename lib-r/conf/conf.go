package conf

import (
	"errors"
	"github.com/spf13/viper"
	"github.com/synw/terr"
)


func GetConf(name string) (map[string]interface{}, *terr.Trace) {
	// set some defaults for conf
	if name == "dev" {
		viper.SetConfigName("dev_config")
	} else {
		viper.SetConfigName("config")
	}
	viper.AddConfigPath(".")
	viper.SetDefault("addr", "localhost:28015")
	viper.SetDefault("user", "")
	viper.SetDefault("password", "")
	// get the actual conf
	err := viper.ReadInConfig()
	if err != nil {
		var conf map[string]interface{}
		switch err.(type) {
		case viper.ConfigParseError:
			trace := terr.New("conf.getConf", err)
			return conf, trace
		default:
			err := errors.New("Unable to locate config file")
			trace := terr.New("conf.getConf", err)
			return conf, trace
		}
	}
	conf := make(map[string]interface{})
	conf["addr"] = viper.Get("addr")
	conf["user"] = viper.Get("user")
	conf["password"] = viper.Get("password")
	return conf, nil
}
