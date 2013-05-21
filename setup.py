import os
from setuptools import setup, find_packages

README = open(os.path.join(os.path.dirname(__file__), 'README.md')).read()

# allow setup.py to be run from any path
os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

setup(
    name = 'django-pimp-my-filter',
    version = '0.1b',
    packages = find_packages(),
    include_package_data = True,
    license = 'BSD License', # example license
    description = 'An application, that helps you build your own filters and use it.',
    long_description = README,
    url = 'https://github.com/fynjah/django-pimp-my-filter',
    author = 'Anton Ievtushenko',
    author_email = 'fynjah@gmail.com',
    classifiers = [
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License', # example license
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
    ],
)
