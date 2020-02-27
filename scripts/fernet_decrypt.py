# fernet_decrypt.py
#
# This script is consumed by the node.js application to decrypt credentials
# stored in the postgres sql database.
#
# @author Anthony Loukinas <anthony.loukinas@redhat.com>
# @author Daniel Lynch

import base64
import hashlib
import pickle
import json
import os
import sys
import copy
import datetime
import sys

from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.backends import default_backend


class Fernet256(Fernet):

    '''Not techincally Fernet, but uses the base of the Fernet spec and
    uses AES-256-CBC instead of AES-128-CBC. All other functionality
    remain identical.
    '''

    def __init__(self, key, backend=None):
        if backend is None:
            backend = default_backend()

        key = base64.urlsafe_b64decode(key)
        if len(key) != 64:
            raise ValueError(
                "Fernet key must be 64 url-safe base64-encoded bytes."
            )

        self._signing_key = key[:32]
        self._encryption_key = key[32:]
        self._backend = backend


def decrypt_value(encryption_key, value):

    ''' Decrypt a single value, with it's specific encryption key '''

    raw_data = value[len('$encrypted$'):]

    # If the encrypted string contains a UTF8 marker, discard it
    utf8 = raw_data.startswith('UTF8$')
    if utf8:
        raw_data = raw_data[len('UTF8$'):]
    algo, b64data = raw_data.split('$', 1)
    if algo != 'AESCBC':
        raise ValueError('unsupported algorithm: %s' % algo)
    print('b64data: ' + b64data)
    encrypted = base64.b64decode(b64data)
    print('encrypted: ' + str(encrypted))
    f = Fernet256(encryption_key)
    value = f.decrypt(encrypted)

    # If the encrypted string contained a UTF8 marker, decode the data
    if utf8:
        value = value.decode('utf-8')
    return value


def get_encryption_key(field_name, pk):
    '''
    Generate key for encrypted password based on field name,
    ``settings.SECRET_KEY``, and instance pk (if available).
    :param pk: (optional) the primary key of the model object;
               can be omitted in situations where you're encrypting a setting
               that is not database-persistent (like a read-only setting)
    '''
    h = hashlib.sha512()
    h.update('aabbcc'.encode('utf-8'))
    h.update(str(pk).encode('utf-8'))
    h.update(field_name.encode('utf-8'))
    return base64.urlsafe_b64encode(h.digest())


def main():

    print()

#     field_name = sys.argv[1]
#     pk = sys.argv[2]
#     value = sys.argv[3]
    field_name = "privatekey"
    pk = "3"
    value = "$encrypted$UTF8$AESCBC$Z0FBQUFBQmQ4Z0FfNzZyUDk3MUpJZmdJenVpdC0yUEU2czNvYWVrZy0yNHdSWjMya3JXMVJfNHRaUkFtNTFDR0ExNklxeWs5cWpVd0VtQzdKZldneXFmM3hxekptMGtPUnFPb193ZVVheGtDakd5bjhWR2FQZWEyT1JGaE9PUElvdURfSFBwS0dwTlZFREMyREt3MmR6cHY3YkU3WXJFZUhCcGdCVFh3Qk5Qdl96LWZNQlp6Skhfbm5fYzlLdjJVd1VycHBnRUpLV2VvM1BsQ1J0di1pdVNFRzdXZnVPQTNfOVNldkxvWnRLa21vNm1qb1dZX1p0c0I3WUVOUE5BcWxRdklqYUU5SmM5LXBZelpZanR0MDFOTFJoWkluTi1Fc1pPdzhwbV84aENIX0p4SnBFRnVSNjJ4N3hpbVlLWVZmcVlxeTRwZDZMS0pHaVpCRlB1dGFQVVNKc3l1MzFLRGI1em1XaGtSOG5xVFYzU19yUklUMFNyTnBWQU1LdnFfLXc5NkdIcy1lTXRRRi1kT19wZ2pEYWZUeFJtZDFBRjhPWDVGQld2UXFzdHM2cmwyOWNiOUJYRGdNM3JJYm9JYWs4dFpWX1lIVkZDQU1heVZlakxHUVc2LVg0b0o1clpXN1I5UjcwU0UyUmV2Q1Z3UUpQMENFWS11dWw0STBlMTVfWFd6ZkR5VUR5SW4zbm9JUE5OeTNIeGJ1cHZwTEJFTDJJZnlVa2JmbU1rSTZERTkyWHpqRUxBSXd4Nk85MU02Uk1BQjFyVkFsbWxJa0YwVGtqbFY1cnBlc19hY29kVW5Pd3pVcE1Fc2hJSjVIN0FJRVRXZE44dUxvUVRjQmlJNy1WdVhDMjUyOUdydElOQUc5V0s5RnEwTUFXTE11NnpSWjhHXy1mTWFqdzltRXJEZjZobmV3LWFMZEVZRUptYm8zTlRzZDA4Q3owazVQZ0xrMHRJSU1SZ19zbDh1NHNzYjlnVnVNeVVKYldBVW0wTENudi1FcXhqdmpoTzFJY3c0QUFwVFJKTk9QNG41RGotNTdzUUs0UXRuMTJ6MkdYcWg5UGNzZEhtekN5RC00bDlIaWpQb3Rfc0dQUzdaUmRCdldnc2Nnb3ZYRUlLNGp5dERQWWMxNEE5Mmd2QjRSWnVwbjhDNUZvZmhBbzlWQlI2RV9EMDdvc2hERENIbnNkQVFFUDE0NlpvVDRwMWs5dGNBVHVUYkVmQU1Kamc3N3Zhb2NTMmRWMnl4ZHYwM2owaV93cnhOdEh4eHh5YjB1d0lLcTZ1WHQteXFVNTNjX19uNFVQZFFnU0dHdmNqR0NuZnRKcEU5elU0YUxMSXNrM2JfeTE2aVZyME1Od3RIV1hsUlg5TU53NzlfWFlqUWRXUURLbTB4eTM4MUFvNWVFVm52OUtON0RyZzZjVGR2MTNpT01FajNuWWlsYVJfd0U0UW85SG90aWlLMXdhX25sWGd0T1RsMllFbEQ3QU9rOHpyQ1hsM2F4aFk1dlV4blI1djIxOE5ZcXJRbmk4Mmt6VUdwN1BuSkdOOG9xT2Jqc0pTaDdtVVZQYi1nSmFMeGFfSTZPdW9OSzU2VEU1YVZJTWxRcTR2aUw3RnIxc3lZa1QyaHlYdGVmQV9FYnZfZGtsWVlUNWpnSzVfOENfZk8zQ1Jtdm5SSk5QMlA5SFlfcWNqeHlIMVNKLWJwUE1vTUJadGNxYXMxWjNsaDZTUDdMbG5QMWk4TnFaeVpuOFB5ZTk2Q2xZMlFuLVNIVUQ5aFFKQXZkMXVXN2pyMHBWYUNVQndqZnVoOU1tamVUNmZxdVNMZjFTdkd2UjdhTGZsVXlHZ2k5enVTTmc2c1UzLTQzT0E5RnZXdDA4anJYY002YmExOVowSUtUYzEtSTVSd0lDQU9iT2N1MjFLb0Vhb0NkbFhDWm5CNlBzYVhzUjVzeFZsOFJPRUphMi1ES1RsdGtOdzBSdDZONEgtNUtFdENEemtwcFFWc2lkd05GdmRmQkExU3g3ZHpHMWViYkY1ajdBU0Z0cUFJZVV3eG9HSW9VNllVVXA3YXBaNFhkUDBQUlRjSDliZDZoZGZMbm4yTktnOFdkYkg3emxxbGdVMmRUc09oT1JQUzJobW04WHRCTEpSUVI0TE5qZHl5UE84ekszY1oyUUVwT2dRREpYNF9TV1VmdEhvdW5WU2tPbUdfemQxNWNnbnBoVU9jRWs5Uk9mRDN6YkdadWVqOGt3NUJqOHdTQmtmSVZmbVhRQkhiaUN4eHBscDd0RktMbU9EVUNEdnN6aXpmXzNUT3VyaG1lRU44ZnhJUXJXcmNQYXdHdTdHcU5NV01GcjdjMkZud2RZVjVfZ2RJTnRGeUZ2WkN6ZVhTSC1BdUZsZ0ZMYjNWb19hbVVVa1lmZTJtQ3lPcVF4UUtQeVhsaHRoQzZ0S0hWbVd6NmczTkE1VUxBVjFma0VLV2tGLXRtQjJSVWpkdVFNSHNwbk02cjFVS08ySGxuLUlXbDZ2R2YwUVh2RndNVHpHSzBxMTZDTFpLaWJob0dWZ2NrckpIdWpDQmRyTmdJZjhNdXhoS212LXIwMFdIR3FETVZBQnZQQlJHZG0wb2NBOVRqYW5uTmJMcDZHM1lxcWNEUm5DdlJ6UDVDYzk3Y1IyUzNmY3FiM0pNUFExTjJxaGZTMFp1ZTduenpScHB1eXN5VUs4Vm9CS0huNWhicDZkcFFOb3BZZk9IYVFpMXNzS1FtRGNjMU1EZUQ2cmJpTGRyVzQyWEFCWkxDZGZ1SV9MWlBUcEd0NmVzQTI5QWpTeEZRb3RBajB0a05IcWdPZGZ6Y1VBQTliVzZndHY0THNybFMzQ3ZmaFRfaUk1Wjg4T1hNMGp2U1BkYXJjdVl2ME9PUERXLXRDQUVpRklEU3lwbGVoSWtxR2t5NG83QUtPV1FWMEpTVm91YmI1TmFWUW5fNUk3dlpGeDZCRW1lODdDUnNlbDJhbGlYVk5QX0tjV2x1R2pnOFJPT3RWZTJGakg0YlpkdHBmZ3Q1TzBxWXpvR2x5ZzYtc3lFOUpBaW92NC1JZmZJY2FZY1JuTVBVdVNqX2tRblpfVW9DcDFY"

#     print(field_name)
#     print(pk)
#     print(value)

    encryption_key = get_encryption_key(field_name, pk)
    password = decrypt_value(encryption_key, value)

    print('encryption_key: ' + str(encryption_key))
    print('password: ' + str(password))


if __name__ == '__main__':
    main()