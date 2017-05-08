package conf

import (
	"errors"
	"github.com/spf13/viper"
	"github.com/synw/terr"
	"github.com/synw/goregraph/lib-r/types"
)


func GetConf(dev bool, verbosity int) (*types.Conf, *terr.Trace) {
	var conf *types.Conf
	// set some defaults for conf
	if dev {
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
	addr := viper.Get("addr").(string)
	user := viper.Get("user").(string)
	pwd := viper.Get("password").(string)
	endconf := &types.Conf{addr, user, pwd, dev, verbosity}
	return endconf, nil
}
