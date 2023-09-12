import { Injectable, Type } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { isString } from '@nestjs/common/utils/shared.utils';
import {
  ApiProperty,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';

function Mixin(
  classLike: Type<any>,
  objectName: string = randomStringGenerator(),
) {
  Object.defineProperty(classLike, 'name', { value: objectName });
  Injectable()(classLike);
  return classLike;
}

function createResponseType<T>(clazz: Type<T>, isArray = false) {
  class A {
    @ApiProperty()
    status: string;
  }

  if (isArray) {
    class ResultSet extends A {
      @ApiProperty({ type: clazz, isArray: true })
      resultset: any;
    }
    return Mixin(ResultSet, `ResponseSetOf${clazz.name}`);
  }

  class Result extends A {
    @ApiProperty({ type: clazz })
    result: any;
  }
  return Mixin(Result, `ResponseOf${clazz.name}`);
}

export const SwaggerResponseType = <T>(
  clazz: Type<T>,
  isArray = false,
): Type<any> => createResponseType(clazz, isArray);

/**
 * Swagger response mapper.
 *
 * @example
 * `@ApiOkResponse(getSwaggerResponseOptions(ModelDto))`
 */
export const getSwaggerResponseOptions = (
  clazz: Type<any> | string,
  isArray = false,
): ApiResponseOptions => {
  if (isArray) {
    return {
      schema: {
        type: 'object',
        properties: {
          resultset: {
            items: isString(clazz)
              ? { type: clazz }
              : { $ref: getSchemaPath(clazz) },
          },
          status: { enum: ['ok', 'failed'] },
        },
      },
    };
  }
  return {
    schema: {
      type: 'object',
      properties: {
        result: isString(clazz)
          ? { type: clazz }
          : { $ref: getSchemaPath(clazz) },
        status: { enum: ['ok', 'failed'] },
      },
    },
  };
};
