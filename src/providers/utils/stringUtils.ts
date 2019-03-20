import { Injectable } from '@angular/core';

@Injectable()
export class StringUtils {

  removeAccents(str) {
    var accents    = 'ÀÁÂÃÄÅàáâãäåßÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    var accentsOut = "AAAAAAaaaaaaBOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    str = str.split('');
    var strLen = str.length;
    var i, x;
    for (i = 0; i < strLen; i++) {
      if ((x = accents.indexOf(str[i])) != -1) {
        str[i] = accentsOut[x];
      }
    }
    return str.join('');
  }

  toUpperCase(str){
    if(str == null){
      return null;
    }
    return str.toUpperCase();
  }

  trim(str){
    if(str == null){
      return null;
    }
    return str.trim();
  }

  cleanTextForGame(str){
    var result = this.removeAccents(str);
    result = this.toUpperCase(result);
    result = this.trim(result);

    return result;

  }
}