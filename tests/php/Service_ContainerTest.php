<?php

use BEA\Theme\Framework\Framework;
use BEA\Theme\Framework\Service;
use BEA\Theme\Framework\Service_Container;
use BEA\Theme\Framework\Services\Theme;

if ( ! class_exists( 'Service_Container_Fake_Service' ) ) {
	/**
	 * Minimal service recording the calls made by the container.
	 */
	class Service_Container_Fake_Service implements Service {
		/**
		 * @var string[]
		 */
		public static $calls = [];

		/**
		 * @var Service_Container[]
		 */
		public static $containers = [];

		public function register( Service_Container $container ): void {
			self::$calls[]      = static::class . '::register';
			self::$containers[] = $container;
		}

		public function boot( Service_Container $container ): void {
			self::$calls[]      = static::class . '::boot';
			self::$containers[] = $container;
		}

		public function get_service_name(): string {
			return 'fake-service';
		}
	}
}

if ( ! class_exists( 'Service_Container_Other_Fake_Service' ) ) {
	class Service_Container_Other_Fake_Service extends Service_Container_Fake_Service {
		public function get_service_name(): string {
			return 'other-fake-service';
		}
	}
}

if ( ! class_exists( 'Service_Container_Not_A_Service' ) ) {
	class Service_Container_Not_A_Service {
		public function get_service_name(): string {
			return 'not-a-service';
		}
	}
}

class Service_ContainerTest extends WP_UnitTestCase {

	public function set_up(): void {
		parent::set_up();

		Service_Container_Fake_Service::$calls      = [];
		Service_Container_Fake_Service::$containers = [];
	}

	public function test_register_non_existing_class(): void {
		$container = new Service_Container();

		$this->assertFalse( $container->register_service( 'Not_Existing_Class' ) );
		$this->assertFalse( $container->get_service( 'Not_Existing_Class' ) );
	}

	public function test_register_class_not_implementing_service(): void {
		$container = new Service_Container();

		$this->assertFalse( $container->register_service( Service_Container_Not_A_Service::class ) );
		$this->assertFalse( $container->get_service( Service_Container_Not_A_Service::class ) );
	}

	public function test_register_service(): void {
		$container = new Service_Container();

		$this->assertTrue( $container->register_service( Service_Container_Fake_Service::class ) );
		// Services are not instantiated before boot.
		$this->assertSame( [], Service_Container_Fake_Service::$calls );
		$this->assertFalse( $container->get_service( 'fake-service' ) );
	}

	public function test_register_service_twice(): void {
		$container = new Service_Container();

		$this->assertTrue( $container->register_service( Service_Container_Fake_Service::class ) );
		$this->assertTrue( $container->register_service( Service_Container_Fake_Service::class ) );

		$container->boot_services();

		// Registered once only.
		$this->assertSame(
			[
				'Service_Container_Fake_Service::register',
				'Service_Container_Fake_Service::boot',
			],
			Service_Container_Fake_Service::$calls
		);
	}

	public function test_get_unknown_service(): void {
		$this->assertFalse( ( new Service_Container() )->get_service( 'unknown' ) );
	}

	public function test_boot_services_without_services(): void {
		$container = new Service_Container();

		$container->boot_services();

		$this->assertSame( [], Service_Container_Fake_Service::$calls );
		$this->assertFalse( $container->get_service( 'fake-service' ) );
	}

	public function test_boot_services(): void {
		$container = new Service_Container();
		$container->register_service( Service_Container_Fake_Service::class );
		$container->register_service( Service_Container_Other_Fake_Service::class );

		$container->boot_services();

		// Every service is registered before any service is booted.
		$this->assertSame(
			[
				'Service_Container_Fake_Service::register',
				'Service_Container_Other_Fake_Service::register',
				'Service_Container_Fake_Service::boot',
				'Service_Container_Other_Fake_Service::boot',
			],
			Service_Container_Fake_Service::$calls
		);

		// The container passes itself to the services.
		$this->assertCount( 4, Service_Container_Fake_Service::$containers );
		foreach ( Service_Container_Fake_Service::$containers as $passed_container ) {
			$this->assertSame( $container, $passed_container );
		}
	}

	public function test_get_service_by_name(): void {
		$container = new Service_Container();
		$container->register_service( Service_Container_Fake_Service::class );
		$container->register_service( Service_Container_Other_Fake_Service::class );

		$container->boot_services();

		$service = $container->get_service( 'fake-service' );
		$this->assertInstanceOf( Service_Container_Fake_Service::class, $service );
		$this->assertNotInstanceOf( Service_Container_Other_Fake_Service::class, $service );
		$this->assertInstanceOf( Service_Container_Other_Fake_Service::class, $container->get_service( 'other-fake-service' ) );

		// Same instance on each call.
		$this->assertSame( $service, $container->get_service( 'fake-service' ) );
	}

	public function test_get_service_by_class_name_returns_class_name(): void {
		$container = new Service_Container();
		$container->register_service( Service_Container_Fake_Service::class );

		// Suspected bug, current behaviour: lookup by class name returns the registered class name string, not the instance.
		$this->assertSame( Service_Container_Fake_Service::class, $container->get_service( Service_Container_Fake_Service::class ) );

		$container->boot_services();

		$this->assertSame( Service_Container_Fake_Service::class, $container->get_service( Service_Container_Fake_Service::class ) );
	}

	public function test_theme_container_get_service_by_class_name_returns_class_name(): void {
		$container = Framework::get_container();

		$this->assertInstanceOf( Theme::class, $container->get_service( 'theme' ) );
		// Suspected bug, current behaviour: same as above on the container booted by the theme.
		$this->assertSame( Theme::class, $container->get_service( Theme::class ) );
	}

	public function test_boot_services_twice(): void {
		$container = new Service_Container();
		$container->register_service( Service_Container_Fake_Service::class );
		$container->boot_services();

		// Suspected bug, current behaviour: the services list now mixes class names and instances, array_unique() cannot cast the instances to string.
		$this->expectException( Error::class );

		$container->boot_services();
	}
}
