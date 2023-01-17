import * as reflect from 'jsii-reflect';
import { extractDocs, InterfaceSchema } from '../schema';
import { Transpile, TranspiledInterface, TranspiledType } from '../transpile/transpile';
import { InstanceMethods } from './instance-methods';
import { Properties } from './properties';

export class Interface {
  public static isStruct(iface: reflect.InterfaceType): boolean {
    return iface.datatype;
  }

  private readonly implementations: TranspiledType[];
  private readonly bases: TranspiledType[];
  private readonly instanceMethods: InstanceMethods;
  private readonly properties: Properties;

  private readonly transpiled: TranspiledInterface;

  constructor(
    transpile: Transpile,
    private readonly iface: reflect.InterfaceType,
  ) {
    this.transpiled = transpile.interface(iface);
    this.instanceMethods = new InstanceMethods(transpile, iface.ownMethods);
    this.properties = new Properties(transpile, iface.allProperties);
    this.implementations = iface.allImplementations.map((impl) => transpile.type(impl));
    this.bases = iface.interfaces.map((base) => transpile.type(base));
  }

  public toJson(): InterfaceSchema {
    return {
      jsiiId: this.iface.fqn,
      fqn: this.transpiled.type.fqn,
      displayName: this.transpiled.type.fqn.split('.').pop()!,
      implementations: this.implementations.map((impl) => impl.toJson()),
      interfaces: this.bases.map((base) => base.toJson()),
      instanceMethods: this.instanceMethods.toJson(),
      properties: this.properties.toJson(),
      docs: extractDocs(this.iface.docs),
      submoduleJsiiId: this.transpiled.type.submoduleJsiiId,
      submoduleFqn: this.transpiled.type.submoduleFqn,
      sourceFile: this.transpiled.type.source.locationInModule?.filename,
      sourceLine: this.transpiled.type.source.locationInModule?.line,
    };
  }
}
