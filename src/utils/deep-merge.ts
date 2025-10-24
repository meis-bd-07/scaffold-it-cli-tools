function deepMerge<T extends Record<string, any>, U extends Record<string, any>>( target: T, source: U ): T & U {
  for (const key of Object.keys(source) as (keyof U)[]) {
    const srcVal = source[key];
    const tgtVal = target[key as keyof T];

    if (srcVal && typeof srcVal === "object" && !Array.isArray(srcVal)) {
      // Initialize missing target key as object
      if (!tgtVal || typeof tgtVal !== "object") (target as any)[key] = {};
      (target as any)[key] = deepMerge(tgtVal || {}, srcVal);
    } else (target as any)[key] = srcVal;
  }
  return target as T & U;
}


export default deepMerge;